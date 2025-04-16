import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Course, CreateCourseData, getCourse, createCourse, updateCourse } from '../../api/courseService';
import { SubjectType } from '../../types/enums';
import '../../styles/Admin.css';

const CourseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CreateCourseData>({
    title: '',
    description: '',
    subject: SubjectType.Math
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загружаем данные курса, если находимся в режиме редактирования
  useEffect(() => {
    if (isEditMode) {
      const loadCourse = async () => {
        try {
          setIsLoading(true);
          const courseData = await getCourse(id);
          
          setFormData({
            title: courseData.title,
            description: courseData.description,
            subject: courseData.subject
          });
          
          if (courseData.imageUrl) {
            setImagePreview(courseData.imageUrl);
          }
          
          setError(null);
        } catch (err) {
          console.error(`Error loading course ${id}:`, err);
          setError('Kursu yükləmək mümkün olmadı');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadCourse();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'subject' ? value as SubjectType : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImage(file);
      
      // Создаем превью изображения
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      setError('Bütün vacib sahələri doldurun');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const courseData: CreateCourseData = {
        ...formData
      };
      
      if (image) {
        courseData.image = image;
      }
      
      if (isEditMode) {
        await updateCourse(id, courseData);
      } else {
        await createCourse(courseData);
      }
      
      // Перенаправляем на список курсов после успешного сохранения
      navigate('/admin/courses');
    } catch (err) {
      console.error('Error saving course:', err);
      setError(isEditMode ? 'Kursu yeniləmək mümkün olmadı' : 'Kursu yaratmaq mümkün olmadı');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Yüklənir...</div>;
  }

  return (
    <div className="admin-content-wrapper">
      <h1>{isEditMode ? 'Kursu redaktə et' : 'Yeni kurs əlavə et'}</h1>
      
      {error && <div className="message message-error">{error}</div>}
      
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Kursun adı</label>
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
          <label htmlFor="subject">Fənn</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            {Object.values(SubjectType).map(subject => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Kursun şəkli</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Kurs şəkli" />
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => navigate('/admin/courses')}
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

export default CourseForm; 