export const MOCK_STUDENTS = [
  { id: 's1', name: 'Aarav Sharma', email: 'aarav.sharma@student.edu', rollNumber: 'CS2024001' },
  { id: 's2', name: 'Diya Patel', email: 'diya.patel@student.edu', rollNumber: 'CS2024002' },
  { id: 's3', name: 'Arjun Singh', email: 'arjun.singh@student.edu', rollNumber: 'CS2024003' },
  { id: 's4', name: 'Ananya Reddy', email: 'ananya.reddy@student.edu', rollNumber: 'CS2024004' },
  { id: 's5', name: 'Rohan Kumar', email: 'rohan.kumar@student.edu', rollNumber: 'CS2024005' },
  { id: 's6', name: 'Ishita Gupta', email: 'ishita.gupta@student.edu', rollNumber: 'CS2024006' },
  { id: 's7', name: 'Vihaan Verma', email: 'vihaan.verma@student.edu', rollNumber: 'CS2024007' },
  { id: 's8', name: 'Saanvi Joshi', email: 'saanvi.joshi@student.edu', rollNumber: 'CS2024008' },
  { id: 's9', name: 'Aditya Mehta', email: 'aditya.mehta@student.edu', rollNumber: 'CS2024009' },
  { id: 's10', name: 'Kavya Iyer', email: 'kavya.iyer@student.edu', rollNumber: 'CS2024010' },
  { id: 's11', name: 'Reyansh Desai', email: 'reyansh.desai@student.edu', rollNumber: 'CS2024011' },
  { id: 's12', name: 'Myra Agarwal', email: 'myra.agarwal@student.edu', rollNumber: 'CS2024012' },
  { id: 's13', name: 'Ayaan Khan', email: 'ayaan.khan@student.edu', rollNumber: 'CS2024013' },
  { id: 's14', name: 'Kiara Nair', email: 'kiara.nair@student.edu', rollNumber: 'CS2024014' },
  { id: 's15', name: 'Shaurya Mishra', email: 'shaurya.mishra@student.edu', rollNumber: 'CS2024015' },
  { id: 's16', name: 'Aadhya Rao', email: 'aadhya.rao@student.edu', rollNumber: 'CS2024016' },
  { id: 's17', name: 'Vivaan Bhat', email: 'vivaan.bhat@student.edu', rollNumber: 'CS2024017' },
  { id: 's18', name: 'Navya Pillai', email: 'navya.pillai@student.edu', rollNumber: 'CS2024018' },
  { id: 's19', name: 'Kabir Kapoor', email: 'kabir.kapoor@student.edu', rollNumber: 'CS2024019' },
  { id: 's20', name: 'Riya Menon', email: 'riya.menon@student.edu', rollNumber: 'CS2024020' },
  { id: 's21', name: 'Dhruv Pandey', email: 'dhruv.pandey@student.edu', rollNumber: 'CS2024021' },
  { id: 's22', name: 'Anvi Kulkarni', email: 'anvi.kulkarni@student.edu', rollNumber: 'CS2024022' },
  { id: 's23', name: 'Arnav Bhatt', email: 'arnav.bhatt@student.edu', rollNumber: 'CS2024023' },
  { id: 's24', name: 'Siya Srinivasan', email: 'siya.srinivasan@student.edu', rollNumber: 'CS2024024' },
  { id: 's25', name: 'Atharv Shah', email: 'atharv.shah@student.edu', rollNumber: 'CS2024025' },
  { id: 's26', name: 'Prisha Yadav', email: 'prisha.yadav@student.edu', rollNumber: 'CS2024026' },
  { id: 's27', name: 'Sai Chatterjee', email: 'sai.chatterjee@student.edu', rollNumber: 'CS2024027' },
  { id: 's28', name: 'Ira Saxena', email: 'ira.saxena@student.edu', rollNumber: 'CS2024028' },
  { id: 's29', name: 'Yash Malhotra', email: 'yash.malhotra@student.edu', rollNumber: 'CS2024029' },
  { id: 's30', name: 'Tara Banerjee', email: 'tara.banerjee@student.edu', rollNumber: 'CS2024030' },
];

export const MOCK_FACULTIES = [
  { id: 'f1', name: 'Dr. Sarah Johnson', email: 'faculty1@college.edu' },
  { id: 'f2', name: 'Prof. Michael Chen', email: 'faculty2@college.edu' },
  { id: 'f3', name: 'Dr. Emily Rodriguez', email: 'faculty3@college.edu' },
];

export const MOCK_SUBJECTS = [
  { id: 'sub1', name: 'Data Structures', code: 'CS301' },
  { id: 'sub2', name: 'Database Management', code: 'CS302' },
  { id: 'sub3', name: 'Operating Systems', code: 'CS303' },
  { id: 'sub4', name: 'Computer Networks', code: 'CS304' },
  { id: 'sub5', name: 'Software Engineering', code: 'CS305' },
];

export const MOCK_SEMESTERS = [
  {
    id: 'sem1',
    name: 'Fall 2024',
    startDate: '2024-08-15',
    endDate: '2024-12-15',
    subjects: [
      { id: 'sub1', name: 'Data Structures', facultyId: 'f1', facultyName: 'Dr. Sarah Johnson', totalPeriods: 40 },
      { id: 'sub2', name: 'Database Management', facultyId: 'f2', facultyName: 'Prof. Michael Chen', totalPeriods: 35 },
      { id: 'sub3', name: 'Operating Systems', facultyId: 'f3', facultyName: 'Dr. Emily Rodriguez', totalPeriods: 38 },
      { id: 'sub4', name: 'Computer Networks', facultyId: 'f1', facultyName: 'Dr. Sarah Johnson', totalPeriods: 36 },
      { id: 'sub5', name: 'Software Engineering', facultyId: 'f2', facultyName: 'Prof. Michael Chen', totalPeriods: 42 },
    ],
  },
  {
    id: 'sem2',
    name: 'Spring 2025',
    startDate: '2025-01-10',
    endDate: '2025-05-15',
    subjects: [
      { id: 'sub6', name: 'Machine Learning', facultyId: 'f1', facultyName: 'Dr. Sarah Johnson', totalPeriods: 40 },
      { id: 'sub7', name: 'Web Development', facultyId: 'f2', facultyName: 'Prof. Michael Chen', totalPeriods: 38 },
      { id: 'sub8', name: 'Artificial Intelligence', facultyId: 'f3', facultyName: 'Dr. Emily Rodriguez', totalPeriods: 36 },
      { id: 'sub9', name: 'Cloud Computing', facultyId: 'f1', facultyName: 'Dr. Sarah Johnson', totalPeriods: 34 },
      { id: 'sub10', name: 'Cybersecurity', facultyId: 'f3', facultyName: 'Dr. Emily Rodriguez', totalPeriods: 40 },
    ],
  },
];
