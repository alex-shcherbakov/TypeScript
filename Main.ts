// Визначення базових типів:
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";

type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

// Створення основних структур:
type Professor = {
    id: number;
    name: string;
    department: string;
};
type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};
type Course = {
    id: number;
    name: string;
    type: CourseType;
};
type Lesson = {
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

// Робота з масивами даних
let professors: Professor[] = [];
let classrooms: Classroom[] = [];
let courses: Course[] = [];
let schedule: Lesson[] = []; 

function addProfessor(professor: Professor): void {
  if (!professor.id || !professor.name || !professor.department) {
      throw new Error("Invalid professor data");
  }
  if (professors.some(p => p.id === professor.id)) {
      throw new Error("Professor with this ID already exists");
  }
  professors.push(professor);
}

function addLesson(lesson: Lesson): boolean {
  const courseExists = courses.some(course => course.id === lesson.courseId);
  const professorExists = professors.some(prof => prof.id === lesson.professorId);
  const classroomExists = classrooms.some(classroom => classroom.number === lesson.classroomNumber);

  if (!courseExists || !professorExists || !classroomExists) {
      console.log("Invalid courseId, professorId, or classroomNumber");
      return false;
  }

  const conflict = validateLesson(lesson);
  if (conflict === null) {
      schedule.push(lesson);
      return true;
  }
  return false;
}

// Функції пошуку та фільтрації:
function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
  if (!timeSlot || !dayOfWeek) {
      console.log("Invalid timeSlot or dayOfWeek");
      return [];
  }

  const occupiedClassrooms = schedule
      .filter(lesson => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
      .map(lesson => lesson.classroomNumber);

  return classrooms
      .filter(classroom => !occupiedClassrooms.includes(classroom.number))
      .map(classroom => classroom.number);
}

function getProfessorSchedule(professorId: number): Lesson[] {
  const professorExists = professors.some(prof => prof.id === professorId);
  if (!professorExists) {
      console.log("Professor not found");
      return [];
  }

  return schedule.filter(lesson => lesson.professorId === professorId);
}

// Обробка конфліктів та валідація:
type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

function validateLesson(lesson: Lesson): ScheduleConflict | null {
  const classroomConflict = schedule.find(
      (scheduledLesson) =>
          scheduledLesson.classroomNumber === lesson.classroomNumber &&
          scheduledLesson.dayOfWeek === lesson.dayOfWeek &&
          scheduledLesson.timeSlot === lesson.timeSlot
  );

  if (classroomConflict) {
      return {
          type: "ClassroomConflict",
          lessonDetails: classroomConflict
      };
  }

  const professorConflict = schedule.find(
      (scheduledLesson) =>
          scheduledLesson.professorId === lesson.professorId &&
          scheduledLesson.dayOfWeek === lesson.dayOfWeek &&
          scheduledLesson.timeSlot === lesson.timeSlot
  );

  if (professorConflict) {
      return {
          type: "ProfessorConflict",
          lessonDetails: professorConflict
      };
  }

  return null;
}

// Аналіз та звіти:
function getClassroomUtilization(classroomNumber: string): number {
  const classroomExists = classrooms.some(classroom => classroom.number === classroomNumber);
  if (!classroomExists) {
      console.log("Classroom not found");
      return 0;
  }

  const lessonsInClassroom = schedule.filter(lesson => lesson.classroomNumber === classroomNumber);
  const totalLessons = lessonsInClassroom.length;
  const totalPossibleLessons = 5 * 6;

  return totalLessons > 0 ? (totalLessons / totalPossibleLessons) * 100 : 0;
}

function getMostPopularCourseType(): CourseType {
  if (schedule.length === 0) {
      console.log("No lessons scheduled");
      return "Lecture";
  }

  const courseTypeCount: Record<CourseType, number> = {
      "Lecture": 0,
      "Seminar": 0,
      "Lab": 0,
      "Practice": 0
  };

  schedule.forEach(lesson => {
      const course = courses.find(c => c.id === lesson.courseId);
      if (course) {
          courseTypeCount[course.type]++;
      }
  });

  return Object.keys(courseTypeCount).reduce((a, b) =>
      courseTypeCount[a as CourseType] > courseTypeCount[b as CourseType] ? a : b
  ) as CourseType;
}

// Модифікація даних:
function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
  const lessonIndex = schedule.findIndex(lesson => lesson.courseId === lessonId);
  if (lessonIndex === -1) {
      console.log("Lesson not found.");
      return false;
  }

  const classroomExists = classrooms.some(classroom => classroom.number === newClassroomNumber);
  if (!classroomExists) {
      console.log("New classroom not found.");
      return false;
  }

  const lessonToReassign = schedule[lessonIndex];
  const conflict = schedule.some((scheduledLesson) =>
      scheduledLesson.classroomNumber === newClassroomNumber &&
      scheduledLesson.dayOfWeek === lessonToReassign.dayOfWeek &&
      scheduledLesson.timeSlot === lessonToReassign.timeSlot
  );

  if (conflict) {
      console.log("Conflict: new classroom is already occupied.");
      return false;
  }

  schedule[lessonIndex].classroomNumber = newClassroomNumber;
  return true;
}

function cancelLesson(lessonId: number): void {
  const lessonIndex = schedule.findIndex(lesson => lesson.courseId === lessonId);
  if (lessonIndex === -1) {
      console.log("Lesson not found.");
      return;
  }

  schedule.splice(lessonIndex, 1);
  console.log(`Lesson with ID ${lessonId} has been canceled.`);
}

// Використання створеного функціоналу: 
function ScheduleUsage() {
    const professor1 = { id: 1, name: 'Іван Петров', department: 'Математика' };
    const professor2 = { id: 2, name: 'Марія Сидорова', department: 'Фізика' };
  
    const classroom1 = { number: 'A101', capacity: 30, hasProjector: true };
    const classroom2 = { number: 'B202', capacity: 25, hasProjector: false };
  
    const course1: Course = { id: 1, name: 'Вища математика', type: 'Lecture' }; 
    const course2: Course = { id: 2, name: 'Загальна фізика', type: 'Lab' };
  
    addProfessor(professor1);
    addProfessor(professor2);
    classrooms.push(classroom1, classroom2);
    courses.push(course1, course2);
  
    addLesson({
      courseId: 1,
      professorId: 1,
      classroomNumber: 'A101',
      dayOfWeek: 'Monday',
      timeSlot: '10:15-11:45',
    });
  
    addLesson({
      courseId: 2,
      professorId: 2,
      classroomNumber: 'B202',
      dayOfWeek: 'Wednesday',
      timeSlot: '14:00-15:30',
    });
  
    console.log('Вільні аудиторії у вівторок о 10:15-11:45:', findAvailableClassrooms('10:15-11:45', 'Tuesday'));
  
    console.log('Розклад професора Івана Петрова:', getProfessorSchedule(1));
  
    const conflict = validateLesson({
      courseId: 1,
      professorId: 1,
      classroomNumber: 'A101',
      dayOfWeek: 'Monday',
      timeSlot: '10:15-11:45', // Спроба додати заняття в той же час і аудиторію
    });
    if (conflict) {
      console.log('Конфлікт:', conflict);
    }
  
    console.log('Відсоток використання аудиторії A101:', getClassroomUtilization('A101'));
    console.log('Найпопулярніший тип занять:', getMostPopularCourseType());
  
    reassignClassroom(1, 'B202'); // Спроба перемістити перше заняття в аудиторію B202
    console.log('Розклад професора Івана Петрова після перепризначення:', getProfessorSchedule(1));
  
    cancelLesson(1);
    console.log('Розклад професора Івана Петрова після скасування:', getProfessorSchedule(1));
}

ScheduleUsage();
