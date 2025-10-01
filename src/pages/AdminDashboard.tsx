import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAttendance } from '@/contexts/AttendanceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AlertCircle, TrendingUp, Users, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_FACULTIES, MOCK_SUBJECTS } from '@/data/mockData';

export default function AdminDashboard() {
  const { semesters, addSemester, updateSemester, students, attendance, getActiveSemester } = useAttendance();
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSemesterId, setEditingSemesterId] = useState<string | null>(null);
  
  // Form state
  const [newSemesterName, setNewSemesterName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numSubjects, setNumSubjects] = useState(5);
  const [subjectAssignments, setSubjectAssignments] = useState<Array<{ name: string; facultyId: string }>>([]);

  useEffect(() => {
    const active = getActiveSemester();
    if (active) setSelectedSemester(active.id);
  }, [getActiveSemester]);

  useEffect(() => {
    if (numSubjects > 0) {
      setSubjectAssignments(
        Array.from({ length: numSubjects }, (_, i) => ({
          name: MOCK_SUBJECTS[i]?.name || `Subject ${i + 1}`,
          facultyId: MOCK_FACULTIES[i % MOCK_FACULTIES.length].id,
        }))
      );
    }
  }, [numSubjects]);

  const handleCreateSemester = () => {
    if (!newSemesterName || !startDate || !endDate || subjectAssignments.length === 0) {
      toast.error('Please fill all fields');
      return;
    }

    const subjects = subjectAssignments.map((assignment, index) => {
      const faculty = MOCK_FACULTIES.find((f) => f.id === assignment.facultyId);
      return {
        id: `sub-${Date.now()}-${index}`,
        name: assignment.name,
        facultyId: assignment.facultyId,
        facultyName: faculty?.name || 'Unknown',
        totalPeriods: 0,
      };
    });

    if (editingSemesterId) {
      updateSemester(editingSemesterId, {
        name: newSemesterName,
        startDate,
        endDate,
        subjects,
      });
      toast.success('Semester updated successfully!');
      setEditingSemesterId(null);
    } else {
      addSemester({
        name: newSemesterName,
        startDate,
        endDate,
        subjects,
      });
      toast.success('Semester created successfully!');
    }

    setShowCreateForm(false);
    setNewSemesterName('');
    setStartDate('');
    setEndDate('');
  };

  const handleEditSemester = (semester: any) => {
    setEditingSemesterId(semester.id);
    setNewSemesterName(semester.name);
    setStartDate(semester.startDate);
    setEndDate(semester.endDate);
    setNumSubjects(semester.subjects.length);
    setSubjectAssignments(
      semester.subjects.map((sub: any) => ({
        name: sub.name,
        facultyId: sub.facultyId,
      }))
    );
    setShowCreateForm(true);
  };

  // Calculate statistics
  const currentSemester = semesters.find((s) => s.id === selectedSemester);
  const semesterAttendance = attendance.filter((a) => a.semesterId === selectedSemester);

  const overallStats = {
    totalStudents: students.length,
    totalSubjects: currentSemester?.subjects.length || 0,
    averageAttendance: semesterAttendance.length > 0
      ? ((semesterAttendance.filter((a) => a.status === 'present').length / semesterAttendance.length) * 100).toFixed(1)
      : '0',
  };

  // Low attendance students (<75%)
  const lowAttendanceStudents = students
    .map((student) => {
      const studentRecords = semesterAttendance.filter((a) => a.studentId === student.id);
      const percentage = studentRecords.length > 0
        ? (studentRecords.filter((a) => a.status === 'present').length / studentRecords.length) * 100
        : 100;
      return { ...student, percentage };
    })
    .filter((s) => s.percentage < 75)
    .sort((a, b) => a.percentage - b.percentage);

  // Subject-wise attendance
  const subjectData = currentSemester?.subjects.map((subject) => {
    const subjectRecords = semesterAttendance.filter((a) => a.subjectId === subject.id);
    const percentage = subjectRecords.length > 0
      ? (subjectRecords.filter((a) => a.status === 'present').length / subjectRecords.length) * 100
      : 0;
    return {
      name: subject.name.length > 15 ? subject.name.substring(0, 15) + '...' : subject.name,
      attendance: Math.round(percentage),
    };
  }) || [];

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:w-auto">
            <Label htmlFor="semester-select" className="mb-2 block">Select Semester</Label>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger id="semester-select" className="w-full sm:w-64">
                <SelectValue placeholder="Choose semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((sem) => (
                  <SelectItem key={sem.id} value={sem.id}>
                    {sem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            {currentSemester && (
              <Button 
                variant="outline" 
                onClick={() => handleEditSemester(currentSemester)}
                className="w-full sm:w-auto"
              >
                Edit Semester
              </Button>
            )}
            <Button 
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                if (showCreateForm) {
                  setEditingSemesterId(null);
                  setNewSemesterName('');
                  setStartDate('');
                  setEndDate('');
                }
              }} 
              className="w-full sm:w-auto"
            >
              {showCreateForm ? 'Cancel' : 'Create Semester'}
            </Button>
          </div>
        </div>

        {/* Create Semester Form */}
        {showCreateForm && (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>{editingSemesterId ? 'Edit Semester' : 'Create New Semester'}</CardTitle>
              <CardDescription>
                {editingSemesterId ? 'Review and update semester details' : 'Set up a new semester with subjects and faculty assignments'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sem-name">Semester Name</Label>
                  <Input
                    id="sem-name"
                    placeholder="e.g., Fall 2025"
                    value={newSemesterName}
                    onChange={(e) => setNewSemesterName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="num-subjects">Number of Subjects</Label>
                  <Input
                    id="num-subjects"
                    type="number"
                    min="1"
                    max="10"
                    value={numSubjects}
                    onChange={(e) => setNumSubjects(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Subject Assignments</Label>
                {subjectAssignments.map((assignment, index) => (
                  <div key={index} className="grid sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Subject Name"
                      value={assignment.name}
                      onChange={(e) => {
                        const updated = [...subjectAssignments];
                        updated[index].name = e.target.value;
                        setSubjectAssignments(updated);
                      }}
                    />
                    <Select
                      value={assignment.facultyId}
                      onValueChange={(value) => {
                        const updated = [...subjectAssignments];
                        updated[index].facultyId = value;
                        setSubjectAssignments(updated);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Assign Faculty" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_FACULTIES.map((faculty) => (
                          <SelectItem key={faculty.id} value={faculty.id}>
                            {faculty.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <Button onClick={handleCreateSemester} className="w-full">
                {editingSemesterId ? 'Update Semester' : 'Create Semester'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{overallStats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Subjects</p>
                  <p className="text-2xl font-bold">{overallStats.totalSubjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Attendance</p>
                  <p className="text-2xl font-bold">{overallStats.averageAttendance}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Subject-wise Attendance</CardTitle>
              <CardDescription>Average attendance percentage by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Low Attendance Alert
              </CardTitle>
              <CardDescription>Students below 75% attendance threshold</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {lowAttendanceStudents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No students with low attendance
                  </p>
                ) : (
                  lowAttendanceStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.rollNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-warning">{student.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
