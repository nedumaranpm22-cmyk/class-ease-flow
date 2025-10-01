import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAttendance } from '@/contexts/AttendanceContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { BookOpen, Calendar, CheckCircle2 } from 'lucide-react';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const { semesters, students, updateSubjectPeriods, markAttendance, getActiveSemester } = useAttendance();
  
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState<Record<string, boolean>>({});
  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [newTotalPeriods, setNewTotalPeriods] = useState<number>(40);

  useEffect(() => {
    const active = getActiveSemester();
    if (active) setSelectedSemester(active.id);
  }, [getActiveSemester]);

  useEffect(() => {
    // Initialize all students as present by default
    const initialState: Record<string, boolean> = {};
    students.forEach((student) => {
      initialState[student.id] = true;
    });
    setAttendanceState(initialState);
  }, [students]);

  const currentSemester = semesters.find((s) => s.id === selectedSemester);
  const facultySubjects = currentSemester?.subjects.filter((sub) => sub.facultyId === user?.id) || [];
  const currentSubject = facultySubjects.find((s) => s.id === selectedSubject);

  const handleSetTotalPeriods = () => {
    if (!selectedSemester || !selectedSubject) {
      toast.error('Please select semester and subject');
      return;
    }
    updateSubjectPeriods(selectedSemester, selectedSubject, newTotalPeriods);
    toast.success(`Total periods set to ${newTotalPeriods}`);
    setShowPeriodForm(false);
  };

  const handleSubmitAttendance = () => {
    if (!selectedSemester || !selectedSubject || !attendanceDate) {
      toast.error('Please fill all required fields');
      return;
    }

    const records = students.map((student) => ({
      studentId: student.id,
      subjectId: selectedSubject,
      semesterId: selectedSemester,
      periodNumber: selectedPeriod,
      date: attendanceDate,
      status: attendanceState[student.id] ? ('present' as const) : ('absent' as const),
    }));

    markAttendance(records);
    toast.success(`Attendance marked for Period ${selectedPeriod}`);
  };

  const toggleAll = (checked: boolean) => {
    const newState: Record<string, boolean> = {};
    students.forEach((student) => {
      newState[student.id] = checked;
    });
    setAttendanceState(newState);
  };

  const presentCount = Object.values(attendanceState).filter((v) => v).length;
  const absentCount = students.length - presentCount;

  return (
    <DashboardLayout title="Faculty Dashboard">
      <div className="space-y-6">
        {/* Subject Management */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>My Subjects</CardTitle>
            <CardDescription>Manage periods and mark attendance for your assigned subjects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semester-select">Semester</Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger id="semester-select">
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

              <div className="space-y-2">
                <Label htmlFor="subject-select">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject-select">
                    <SelectValue placeholder="Choose subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {facultySubjects.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {currentSubject && (
              <div className="p-4 bg-accent rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{currentSubject.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Total Periods: {currentSubject.totalPeriods || 'Not set'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowPeriodForm(!showPeriodForm);
                      setNewTotalPeriods(currentSubject.totalPeriods || 40);
                    }}
                  >
                    {showPeriodForm ? 'Cancel' : 'Set Periods'}
                  </Button>
                </div>

                {showPeriodForm && (
                  <div className="mt-4 pt-4 border-t flex gap-3">
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={newTotalPeriods}
                      onChange={(e) => setNewTotalPeriods(parseInt(e.target.value) || 1)}
                      placeholder="Total periods"
                    />
                    <Button onClick={handleSetTotalPeriods}>Save</Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Marking */}
        {currentSubject && currentSubject.totalPeriods > 0 && (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Mark Attendance</CardTitle>
              <CardDescription>Record attendance for a specific period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period-select">Period Number</Label>
                  <Select value={selectedPeriod.toString()} onValueChange={(v) => setSelectedPeriod(parseInt(v))}>
                    <SelectTrigger id="period-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: currentSubject.totalPeriods }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          Period {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-input">Date</Label>
                  <Input
                    id="date-input"
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{students.length}</p>
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold text-secondary">{presentCount}</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Absent</p>
                  <p className="text-2xl font-bold text-destructive">{absentCount}</p>
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleAll(true)} className="flex-1">
                  Mark All Present
                </Button>
                <Button variant="outline" size="sm" onClick={() => toggleAll(false)} className="flex-1">
                  Mark All Absent
                </Button>
              </div>

              {/* Student List */}
              <div className="border rounded-lg">
                <div className="max-h-96 overflow-y-auto">
                  {students.map((student, index) => (
                    <div
                      key={student.id}
                      className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors ${
                        index !== students.length - 1 ? 'border-b' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={attendanceState[student.id]}
                          onCheckedChange={(checked) =>
                            setAttendanceState({ ...attendanceState, [student.id]: checked as boolean })
                          }
                        />
                        <Label
                          htmlFor={`student-${student.id}`}
                          className={`cursor-pointer ${
                            attendanceState[student.id] ? 'text-secondary' : 'text-muted-foreground'
                          }`}
                        >
                          {attendanceState[student.id] ? 'Present' : 'Absent'}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleSubmitAttendance} className="w-full h-11" size="lg">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Submit Attendance
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
