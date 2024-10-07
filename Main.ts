// a) Type alias для днів тижня
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

// b) Union type для часових слотів
type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";

// c) Type alias для типів занять
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

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

let professors: Professor[] = [];
let classrooms: Classroom[] = [];
let courses: Course[] = [];
let schedule: Lesson[] = []; 

function addProfessor(professor: Professor): void {
    if (professors.some(p => p.id === professor.id)) {
        throw new Error("Professor with this ID already exists");
    }
    professors.push(professor);
}

function addLesson(lesson: Lesson): boolean {
    const conflict = validateLesson(lesson);
    if (conflict === null) {
        schedule.push(lesson);
        return true;
    }
    return false;
}

function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    // Знаходимо всі аудиторії, зайняті в зазначений час і день
    const occupiedClassrooms = schedule
      .filter(lesson => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
      .map(lesson => lesson.classroomNumber);
  
    // Повертаємо аудиторії, які не зайняті
    return classrooms
      .filter(classroom => !occupiedClassrooms.includes(classroom.number))
      .map(classroom => classroom.number);
}

function getProfessorSchedule(professorId: number): Lesson[] {
    // Повертаємо всі заняття, які викладає зазначений професор
    return schedule.filter(lesson => lesson.professorId === professorId);
}

type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

function validateLesson(lesson: Lesson): ScheduleConflict | null {
    // Перевірка на конфлікт аудиторії
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
  
    // Перевірка на конфлікт професора
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
  
    // Якщо конфліктів немає
    return null;
}

function getClassroomUtilization(classroomNumber: string): number {
    // Знаходимо всі заняття в зазначеній аудиторії
    const lessonsInClassroom = schedule.filter(lesson => lesson.classroomNumber === classroomNumber);
    
    // Загальна кількість занять в аудиторії
    const totalLessons = lessonsInClassroom.length;
  
    // Загальна кількість занять в тижні (припустимо 5 днів по 6 занять на день = 30 занять)
    const totalPossibleLessons = 5 * 6; // або можете використовувати кількість годин/днів у вашому розкладі
  
    // Відсоток використання
    return totalLessons > 0 ? (totalLessons / totalPossibleLessons) * 100 : 0;
}

function getMostPopularCourseType(): CourseType {
    const courseTypeCount: Record<CourseType, number> = {
      "Lecture": 0,
      "Seminar": 0,
      "Lab": 0,
      "Practice": 0
    };
  
    // Підрахунок кількості занять для кожного типу курсу
    schedule.forEach(lesson => {
      const course = courses.find(c => c.id === lesson.courseId);
      if (course) {
        courseTypeCount[course.type]++;
      }
    });
  
    // Знаходимо тип курсу з найбільшою кількістю занять
    return Object.keys(courseTypeCount).reduce((a, b) =>
      courseTypeCount[a as CourseType] > courseTypeCount[b as CourseType] ? a : b
    ) as CourseType;
}

function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lessonIndex = schedule.findIndex(lesson => lesson.courseId === lessonId);
  
    if (lessonIndex === -1) {
      console.log("Заняття не знайдено.");
      return false; // Заняття не знайдено
    }
  
    const lessonToReassign = schedule[lessonIndex];
  
    // Перевірка на конфлікт з новою аудиторією
    const conflict = schedule.some((scheduledLesson) =>
      scheduledLesson.classroomNumber === newClassroomNumber &&
      scheduledLesson.dayOfWeek === lessonToReassign.dayOfWeek &&
      scheduledLesson.timeSlot === lessonToReassign.timeSlot
    );
  
    if (conflict) {
      console.log("Конфлікт: нова аудиторія вже зайнята.");
      return false; // Конфлікт, аудиторія вже зайнята
    }
  
    // Зміна аудиторії
    schedule[lessonIndex].classroomNumber = newClassroomNumber;
    return true; // Успішно змінено аудиторію
}

function cancelLesson(lessonId: number): void {
    const lessonIndex = schedule.findIndex(lesson => lesson.courseId === lessonId);
  
    if (lessonIndex !== -1) {
      schedule.splice(lessonIndex, 1); // Видаляємо заняття з розкладу
      console.log(`Заняття з ID ${lessonId} скасовано.`);
    } else {
      console.log("Заняття не знайдено.");
    }
}

function ScheduleUsage() {
    // Створення професорів, аудиторій та курсів
    const professor1 = { id: 1, name: 'Іван Петров', department: 'Математика' };
    const professor2 = { id: 2, name: 'Марія Сидорова', department: 'Фізика' };
  
    const classroom1 = { number: 'A101', capacity: 30, hasProjector: true };
    const classroom2 = { number: 'B202', capacity: 25, hasProjector: false };
  
    const course1: Course = { id: 1, name: 'Вища математика', type: 'Lecture' }; 
    const course2: Course = { id: 2, name: 'Загальна фізика', type: 'Lab' };
  
    // Додавання професорів, аудиторій та курсів до відповідних масивів
    addProfessor(professor1);
    addProfessor(professor2);
    classrooms.push(classroom1, classroom2);
    courses.push(course1, course2);
  
    // Додавання занять
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
  
    // Пошук вільних аудиторій
    console.log('Вільні аудиторії у вівторок о 10:15-11:45:', findAvailableClassrooms('10:15-11:45', 'Tuesday'));
  
    // Розклад професора Івана Петрова
    console.log('Розклад професора Івана Петрова:', getProfessorSchedule(1));
  
    // Перевірка на конфлікт
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
  
    // Використання інших функцій
    console.log('Відсоток використання аудиторії A101:', getClassroomUtilization('A101'));
    console.log('Найпопулярніший тип занять:', getMostPopularCourseType());
  
    // Перепризначення аудиторії
    reassignClassroom(1, 'B202'); // Спроба перемістити перше заняття в аудиторію B202
    console.log('Розклад професора Івана Петрова після перепризначення:', getProfessorSchedule(1));
  
    // Скасування заняття
    cancelLesson(1);
    console.log('Розклад професора Івана Петрова після скасування:', getProfessorSchedule(1));
}

ScheduleUsage();
