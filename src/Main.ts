// Enum
enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

enum Semester {
    First = "First",
    Second = "Second"
}

enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

// Інтерфейси
interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus; 
    enrollmentDate: Date; 
    groupNumber: string; 
}

interface Course {
    id: number;
    name: string;
    type: CourseType; 
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

interface StudentGrade {
    studentId: number; 
    courseId: number; 
    grade: Grade; 
    date: Date; 
    semester: Semester; 
}

//Реалізуйте клас UniversityManagementSystem з наступними методами:
class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: StudentGrade[] = [];
    private studentIdCounter: number = 1;
    private courseIdCounter: number = 1;

    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = { ...student, id: this.studentIdCounter++ };
        this.students.push(newStudent);
        return newStudent;
    }

    registerForCourse(studentId: number, courseId: number): void {
        const student = this.students.find((s) => s.id === studentId);
        const course = this.courses.find((c) => c.id === courseId);
    
        // перевірка на можливість реєстрації на курс
        if (!student) {
            throw new Error(`Студент з ID ${studentId} не знайдений.`);
        }
        if (!course) {
            throw new Error(`Курс з ID ${courseId} не знайдений.`);
        }
        if (this.grades.find((g) => g.studentId === studentId && g.courseId === courseId)) {
            throw new Error("Студент вже зареєстрований на цей курс.");
        }
        const studentsOnCourse = this.grades.filter((g) => g.courseId === courseId).length;
        if (studentsOnCourse >= course.maxStudents) {
            throw new Error(`Кількість студентів на курсі ${courseId} досягла максимуму.`);
        }
        if (student.faculty !== course.faculty) {
            throw new Error(`Студент з факультету ${student.faculty} не може записатися на курс факультету ${course.faculty}.`);
        }
    
        this.grades.push({
            studentId,
            courseId,
            grade: Grade.Unsatisfactory,
            date: new Date(),
            semester: course.semester,
        });
    }

    setGrade(studentId: number, courseId: number, grade: Grade): void {
        const gradeRecord = this.grades.find((g) => g.studentId === studentId && g.courseId === courseId);
    
        // Перевірка на можливість виставлення оцінки (чи зареєстрований студент на курс)
        if (!gradeRecord) {
            throw new Error(`Студент з ID ${studentId} не зареєстрований на курс з ID ${courseId}.`);
        }
    
        gradeRecord.grade = grade;
        gradeRecord.date = new Date();
    }

    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find((s) => s.id === studentId);
    
        // Валідація при зміні статусу студента
        if (!student) {
            throw new Error(`Студент з ID ${studentId} не знайдений.`);
        }
    
        switch (student.status) {
            case StudentStatus.Active:
                if (newStatus !== StudentStatus.Academic_Leave && newStatus !== StudentStatus.Expelled) {
                    throw new Error(`Неможливо змінити статус активного студента на ${newStatus}.`);
                }
                break;
            case StudentStatus.Academic_Leave:
                if (newStatus !== StudentStatus.Active && newStatus !== StudentStatus.Graduated) {
                    throw new Error(`Неможливо змінити статус студента, що перебуває в академічній відпустці, на ${newStatus}.`);
                }
                break;
        }
    
        student.status = newStatus;
    }

    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter((student) => student.faculty === faculty);
    }

    getStudentGrades(studentId: number): StudentGrade[] {
        return this.grades.filter((g) => g.studentId === studentId);
    }

    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter((course) => course.faculty === faculty && course.semester === semester);
    }

    calculateAverageGrade(studentId: number): number {
        const studentGrades = this.getStudentGrades(studentId);

        if (studentGrades.length === 0) {
            throw new Error(`Для студента з ID ${studentId} немає оцінок.`);
        }
        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        return total / studentGrades.length;
    }
    // Метод для отримання списку відмінників по факультету
    getExcellentStudentsByFaculty(faculty: Faculty): Student[] {
        const studentsByFaculty = this.getStudentsByFaculty(faculty);
        return studentsByFaculty.filter(student => {
            const averageGrade = this.calculateAverageGrade(student.id);
            return averageGrade === Grade.Excellent;
        });
    }
}
