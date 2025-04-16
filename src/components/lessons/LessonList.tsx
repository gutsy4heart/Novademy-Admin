import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Lesson, getLessons, getLessonsByCourse, deleteLesson } from '../../api/lessonService';
import { Course, getCourses } from '../../api/courseService';
import { LessonStatus } from '../../types/enums';
import '../../styles/Admin.css';

const LessonList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const courseIdFromQuery = queryParams.get('courseId');

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(courseIdFromQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  // Загружаем список курсов
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
      } catch (err) {
        console.error('Error loading courses:', err);
        setError('Kursları yükləmək mümkün olmadı');
      }
    };

    loadCourses();
  }, []);

  // Загружаем список уроков
  useEffect(() => {
    const loadLessons = async () => {
      try {
        setIsLoading(true);
        
        let lessonsData: Lesson[];
        if (selectedCourseId) {
          lessonsData = await getLessonsByCourse(selectedCourseId);
        } else {
          lessonsData = await getLessons();
        }
        
        setLessons(lessonsData);
        setError(null);
      } catch (err) {
        console.error('Error loading lessons:', err);
        setError('Dərsləri yükləmək mümkün olmadı');
      } finally {
        setIsLoading(false);
      }
    };

    loadLessons();
  }, [selectedCourseId]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = e.target.value || null;
    setSelectedCourseId(courseId);
    
    // Обновляем URL с новым параметром курса
    if (courseId) {
      navigate(`/admin/lessons?courseId=${courseId}`);
    } else {
      navigate('/admin/lessons');
    }
  };

  const handleDeleteClick = (lessonId: string) => {
    setDeleteConfirmation(lessonId);
  };

  const handleDeleteConfirm = async (lessonId: string) => {
    try {
      setIsLoading(true);
      await deleteLesson(lessonId);
      
      // Обновляем список уроков после удаления
      const updatedLessons = lessons.filter(lesson => lesson.id !== lessonId);
      setLessons(updatedLessons);
      
      setSuccessMessage('Dərs uğurla silindi');
      setTimeout(() => setSuccessMessage(null), 3000);
      setDeleteConfirmation(null);
    } catch (err) {
      console.error(`Error deleting lesson ${lessonId}:`, err);
      setError('Dərsi silmək mümkün olmadı');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation(null);
  };

  if (isLoading && lessons.length === 0) {
    return <div className="loading">Yüklənir...</div>;
  }

  return (
    <div className="admin-content-wrapper">
      <div className="admin-header-actions">
        <h1>Dərslər</h1>
        <Link to="/admin/lessons/create" className="btn btn-primary">
          Yeni dərs əlavə et
        </Link>
      </div>

      {error && <div className="message message-error">{error}</div>}
      {successMessage && <div className="message message-success">{successMessage}</div>}

      <div className="filters">
        <div className="form-group">
          <label htmlFor="courseFilter">Kurs üzrə süzgəc:</label>
          <select
            id="courseFilter"
            value={selectedCourseId || ''}
            onChange={handleCourseChange}
          >
            <option value="">Bütün kurslar</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Kurs</th>
              <th>Status</th>
              <th>Pulsuz</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {lessons.length > 0 ? (
              lessons.map(lesson => (
                <tr key={lesson.id}>
                  <td>{lesson.title}</td>
                  <td>{lesson.courseName}</td>
                  <td>{lesson.status}</td>
                  <td>{lesson.isFree ? 'Bəli' : 'Xeyr'}</td>
                  <td className="actions-cell">
                    <Link 
                      to={`/admin/lessons/edit/${lesson.id}`} 
                      className="btn btn-secondary btn-sm"
                    >
                      Redaktə et
                    </Link>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(lesson.id)}
                    >
                      Sil
                    </button>
                    
                    {deleteConfirmation === lesson.id && (
                      <div className="delete-confirmation">
                        <p>Bu dərsi silmək istədiyinizə əminsiniz?</p>
                        <div className="confirmation-actions">
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteConfirm(lesson.id)}
                          >
                            Bəli, sil
                          </button>
                          <button 
                            className="btn btn-cancel btn-sm"
                            onClick={handleDeleteCancel}
                          >
                            Ləğv et
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  {isLoading ? 'Yüklənir...' : 'Dərslər tapılmadı'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LessonList; 