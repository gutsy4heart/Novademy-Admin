import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lesson, CreateLessonData, getLesson, createLesson, updateLesson } from '../../api/lessonService';
import { Course, getCourses } from '../../api/courseService';
import { LessonStatus } from '../../types/enums';
import '../../styles/Admin.css';

const LessonForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CreateLessonData>({
    title: '',
    description: '',
    courseId: '',
    isFree: false,
    status: LessonStatus.Draft
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загружаем список курсов
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
        
        // Устанавливаем первый курс по умолчанию, если курс не выбран
        if (!formData.courseId && coursesData.length > 0) {
          setFormData(prev => ({
            ...prev,
            courseId: coursesData[0].id
          }));
        }
      } catch (err) {
        console.error('Error loading courses:', err);
        setError('Kursları yükləmək mümkün olmadı');
      }
    };

    loadCourses();
  }, [formData.courseId]);

  // Загружаем данные урока, если находимся в режиме редактирования
  useEffect(() => {
    if (isEditMode) {
      const loadLesson = async () => {
        try {
          setIsLoading(true);
          const lessonData = await getLesson(id);
          
          setFormData({
            title: lessonData.title,
            description: lessonData.description,
            courseId: lessonData.courseId,
            isFree: lessonData.isFree,
            status: lessonData.status,
            order: lessonData.order
          });
          
          if (lessonData.videoUrl) {
            setVideoPreview(lessonData.videoUrl);
          }
          
          setError(null);
        } catch (err) {
          console.error(`Error loading lesson ${id}:`, err);
          setError('Dərsi yükləmək mümkün olmadı');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadLesson();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Обработка чекбоксов
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'status' ? value as LessonStatus : value
      }));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setVideo(file);
      
      // Создаем превью видео
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.courseId) {
      setError('Bütün vacib sahələri doldurun');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const lessonData: CreateLessonData = {
        ...formData
      };
      
      if (video) {
        lessonData.video = video;
      }
      
      if (isEditMode) {
        await updateLesson(id, lessonData);
      } else {
        await createLesson(lessonData);
      }
      
      // Перенаправляем на список уроков после успешного сохранения
      navigate('/admin/lessons');
    } catch (err) {
      console.error('Error saving lesson:', err);
      setError(isEditMode ? 'Dərsi yeniləmək mümkün olmadı' : 'Dərsi yaratmaq mümkün olmadı');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Yüklənir...</div>;
  }

  return (
    <div className="admin-content-wrapper">
      <h1>{isEditMode ? 'Dərsi redaktə et' : 'Yeni dərs əlavə et'}</h1>
      
      {error && <div className="message message-error">{error}</div>}
      
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="courseId">Kurs</label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
          >
            <option value="">Kurs seçin</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="title">Dərs başlığı</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Təsvir</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="order">Sıra nömrəsi</label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order?.toString() || ''}
            onChange={handleChange}
            min="1"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            {Object.values(LessonStatus).map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-checkbox">
          <input
            type="checkbox"
            id="isFree"
            name="isFree"
            checked={formData.isFree}
            onChange={handleChange}
          />
          <label htmlFor="isFree">Pulsuz dərs</label>
        </div>
        
        <div className="form-group">
          <label htmlFor="video">Dərs videosu</label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleVideoChange}
          />
          
          {videoPreview && (
            <div className="video-preview">
              <video controls>
                <source src={videoPreview} type="video/mp4" />
                Sizin brauzeriniz video tagını dəstəkləmir.
              </video>
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => navigate('/admin/lessons')}
          >
            Ləğv et
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Yüklənir...' : (isEditMode ? 'Yadda saxla' : 'Yarat')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LessonForm; 