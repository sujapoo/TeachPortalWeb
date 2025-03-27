import React, { useEffect, useState } from 'react';
import { api } from '../Services/api';  
import '../css/Dashboard.css';

const TeacherOverview = () => {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
   
    const fetchTeachers = async () => {
      try {
        const response = await api.get('/teacher');
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="teacher-overview">
    <h2>Teacher Overview</h2>
    <div className="teacher-list">
      {teachers.map((teacher, index) => (
        <div key={index} className="teacher-card">
          <div className="teacher-name">{teacher.name}</div>
          <div className="student-count">Students: {teacher.studentCount}</div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default TeacherOverview;
