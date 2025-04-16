import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../../api/courseService';
import { getLessons } from '../../api/lessonService';
import '../../styles/Admin.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    courses: 0,
    lessons: 0,
    recentCourses: [] as any[],
    recentLessons: [] as any[]
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch courses
        const coursesData = await getCourses();
        
        // Fetch lessons
        const lessonsData = await getLessons();
        
        setStats({
          courses: coursesData.length,
          lessons: lessonsData.length,
          recentCourses: coursesData.slice(0, 5),
          recentLessons: lessonsData.slice(0, 5)
        });
      } catch (err: any) {
        console.error('Error loading dashboard data:', err);
        setError(err.message || 'Məlumatları yükləmək mümkün olmadı');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="loading">Yüklənir...</div>;
  }

  if (error) {
    return <div className="message message-error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>İdarəetmə paneli</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Kurslar</h3>
          <div className="stat-value">{stats.courses}</div>
          <Link to="/admin/courses" className="btn btn-primary btn-sm">Kurslara baxın</Link>
        </div>
        
        <div className="stat-card">
          <h3>Dərslər</h3>
          <div className="stat-value">{stats.lessons}</div>
          <Link to="/admin/lessons" className="btn btn-primary btn-sm">Dərslərə baxın</Link>
        </div>
      </div>
      
      <div className="dashboard-row">
        <div className="dashboard-col">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Son kurslar</h3>
              <Link to="/admin/courses" className="view-all">Hamısına baxın</Link>
            </div>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Adı</th>
                  <th>Fənn</th>
                  <th>Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentCourses.length > 0 ? (
                  stats.recentCourses.map(course => (
                    <tr key={course.id}>
                      <td>{course.title}</td>
                      <td>{course.subject}</td>
                      <td>
                        <Link to={`/admin/courses/edit/${course.id}`} className="btn btn-sm">Redaktə et</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>Kurslar tapılmadı</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="dashboard-col">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Son dərslər</h3>
              <Link to="/admin/lessons" className="view-all">Hamısına baxın</Link>
            </div>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Adı</th>
                  <th>Kurs</th>
                  <th>Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentLessons.length > 0 ? (
                  stats.recentLessons.map(lesson => (
                    <tr key={lesson.id}>
                      <td>{lesson.title}</td>
                      <td>{lesson.courseName}</td>
                      <td>
                        <Link to={`/admin/lessons/edit/${lesson.id}`} className="btn btn-sm">Redaktə et</Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>Dərslər tapılmadı</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 