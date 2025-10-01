import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_STUDENTS, MOCK_SEMESTERS, MOCK_SUBJECTS } from '@/data/mockData';

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
}

export interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  facultyId: string;
  facultyName: string;
  totalPeriods: number;
}

export interface AttendanceRecord {
  studentId: string;
  subjectId: string;
  semesterId: string;
  periodNumber: number;
  date: string;
  status: 'present' | 'absent';
}

interface AttendanceContextType {
  students: Student[];
  semesters: Semester[];
  attendance: AttendanceRecord[];
  markAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  updateSubjectPeriods: (semesterId: string, subjectId: string, totalPeriods: number) => void;
  getStudentWeeklyAttendance: (studentId: string, semesterId: string, weekStart: string) => number;
  addSemester: (semester: Omit<Semester, 'id'>) => void;
  updateSemester: (semesterId: string, updates: Partial<Omit<Semester, 'id'>>) => void;
  getActiveSemester: () => Semester | null;
  isPeriodSubmitted: (semesterId: string, subjectId: string, periodNumber: number) => boolean;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students] = useState<Student[]>(MOCK_STUDENTS);
  const [semesters, setSemesters] = useState<Semester[]>(() => {
    const saved = localStorage.getItem('semesters');
    return saved ? JSON.parse(saved) : MOCK_SEMESTERS;
  });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('attendance');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('semesters', JSON.stringify(semesters));
  }, [semesters]);

  useEffect(() => {
    localStorage.setItem('attendance', JSON.stringify(attendance));
  }, [attendance]);

  const markAttendance = (records: AttendanceRecord[]) => {
    setAttendance((prev) => {
      const newAttendance = [...prev];
      records.forEach((record) => {
        const existingIndex = newAttendance.findIndex(
          (a) =>
            a.studentId === record.studentId &&
            a.subjectId === record.subjectId &&
            a.semesterId === record.semesterId &&
            a.periodNumber === record.periodNumber
        );
        if (existingIndex >= 0) {
          newAttendance[existingIndex] = record;
        } else {
          newAttendance.push(record);
        }
      });
      return newAttendance;
    });
  };

  const updateSubjectPeriods = (semesterId: string, subjectId: string, totalPeriods: number) => {
    setSemesters((prev) =>
      prev.map((sem) =>
        sem.id === semesterId
          ? {
              ...sem,
              subjects: sem.subjects.map((sub) =>
                sub.id === subjectId ? { ...sub, totalPeriods } : sub
              ),
            }
          : sem
      )
    );
  };

  const getStudentWeeklyAttendance = (studentId: string, semesterId: string, weekStart: string): number => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const weekAttendance = attendance.filter((a) => {
      const recordDate = new Date(a.date);
      return (
        a.studentId === studentId &&
        a.semesterId === semesterId &&
        recordDate >= new Date(weekStart) &&
        recordDate <= weekEnd
      );
    });

    if (weekAttendance.length === 0) return 100;

    const present = weekAttendance.filter((a) => a.status === 'present').length;
    return (present / weekAttendance.length) * 100;
  };

  const addSemester = (semester: Omit<Semester, 'id'>) => {
    const newSemester = {
      ...semester,
      id: `sem-${Date.now()}`,
    };
    setSemesters((prev) => [...prev, newSemester]);
  };

  const updateSemester = (semesterId: string, updates: Partial<Omit<Semester, 'id'>>) => {
    setSemesters((prev) =>
      prev.map((sem) => (sem.id === semesterId ? { ...sem, ...updates } : sem))
    );
  };

  const getActiveSemester = (): Semester | null => {
    const now = new Date();
    return semesters.find((sem) => {
      const start = new Date(sem.startDate);
      const end = new Date(sem.endDate);
      return now >= start && now <= end;
    }) || semesters[0] || null;
  };

  const isPeriodSubmitted = (semesterId: string, subjectId: string, periodNumber: number): boolean => {
    return attendance.some(
      (record) =>
        record.semesterId === semesterId &&
        record.subjectId === subjectId &&
        record.periodNumber === periodNumber
    );
  };

  return (
    <AttendanceContext.Provider
      value={{
        students,
        semesters,
        attendance,
        markAttendance,
        updateSubjectPeriods,
        getStudentWeeklyAttendance,
        addSemester,
        updateSemester,
        getActiveSemester,
        isPeriodSubmitted,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};
