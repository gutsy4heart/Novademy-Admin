import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Course, getCourses, deleteCourse } from '../../api/courseService';
import '../../styles/Admin.css';

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const data = await getCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      console.error('Error loading courses:', err);
      setError('Kursları yükləmək mümkün olmadı');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDeleteClick = (courseId: string) => {
    setDeleteConfirmation(courseId);
  };

  const handleDeleteConfirm = async (courseId: string) => {
    try {
      setIsLoading(true);
      await deleteCourse(courseId);
      
      // Обновляем список курсов после удаления
      const updatedCourses = courses.filter(course => course.id !== courseId);
      setCourses(updatedCourses);
      
      setSuccessMessage('Kurs uğurla silindi');
      setTimeout(() => setSuccessMessage(null), 3000);
      setDeleteConfirmation(null);
    } catch (err) {
      console.error(`Error deleting course ${courseId}:`, err);
      setError('Kursu silmək mümkün olmadı');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation(null);
  };

  if (isLoading && courses.length === 0) {
    return <div className="loading">Yüklənir...</div>;
  }

  return (
    <div className="admin-content-wrapper">
      <div className="admin-header-actions">
        <h1>Kurslar</h1>
        <Link to="/admin/courses/create" className="btn btn-primary">
          Yeni kurs əlavə et
        </Link>
      </div>

      {error && <div className="message message-error">{error}</div>}
      {successMessage && <div className="message message-success">{successMessage}</div>}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Fənn</th>
              <th>Yaradılma tarixi</th>
              <th>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map(course => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.subject}</td>
                  <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    <Link 
                      to={`/admin/lessons?courseId=${course.id}`} 
                      className="btn btn-sm"
                      title="Dərslərə baxın"
                    >
                      Dərslər
                    </Link>
                    <Link 
                      to={`/admin/courses/edit/${course.id}`} 
                      className="btn btn-secondary btn-sm"
                    >
                      Redaktə et
                    </Link>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(course.id)}
                    >
                      Sil
                    </button>
                    
                    {deleteConfirmation === course.id && (
                      <div className="delete-confirmation">
                        <p>Bu kursu silmək istədiyinizə əminsiniz?</p>
                        <div className="confirmation-actions">
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteConfirm(course.id)}
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
                <td colSpan={4} className="text-center">
                  {isLoading ? 'Yüklənir...' : 'Kurslar tapılmadı'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseList; 