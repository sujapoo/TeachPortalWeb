import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../Services/AuthService';  
import { api } from '../Services/api';  
import { validateLength, validateEmail } from '../Validation/validation';
import '../css/Dashboard.css';

const DashboardComponent = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Validation state
  const [errors, setErrors] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  useEffect(() => {
    const checkAuthentication = () => {
      if (!AuthService.isAuthenticated()) {
        navigate('/login');
      } else {
        fetchStudents();
      }
      setAuthChecked(true);
    };

    checkAuthentication();
  }, [navigate]);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students');
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    
    newErrors.firstName = validateLength(firstName, 3, 50);

    
    newErrors.lastName = validateLength(lastName, 3, 50);

    
    newErrors.email = validateEmail(email);

   
    setErrors(newErrors);

    
    if (Object.values(newErrors).every((error) => !error)) {
      const newStudent = { firstName, lastName, email };

      try {
        
        const response = await api.post('/students', newStudent);
        if (response.status === 201 || response.status === 200) {
          
          setStudents((prevStudents) => [...prevStudents, newStudent]);
          setFirstName('');
          setLastName('');
          setEmail('');
        } else {
         
          console.error('Failed to add student:', response);
        }
      } catch (error) {
      
        console.error('Error adding student:', error);
      }
    }
  };

 
  const handleSignOut = () => {
    AuthService.logout();  
    navigate('/login');  
  };


  const sortedStudents = [...students].sort((a, b) =>
    a.firstName.localeCompare(b.firstName, undefined, { sensitivity: 'base' })
  );


  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Teacher Dashboard</h2>
      <button onClick={handleSignOut} className="signout-button">
        Sign Out
      </button>
      {loading ? (
        <div>Loading students...</div>
      ) : (
        <>
          <div className="form-container">
            <h3>Add New Student</h3>
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label className="label">First Name:</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input"
                />
                {errors.firstName && <div className="error">{errors.firstName}</div>}
              </div>
              <div className="form-group">
                <label className="label">Last Name:</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input"
                />
                {errors.lastName && <div className="error">{errors.lastName}</div>}
              </div>
              <div className="form-group">
                <label className="label">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
                {errors.email && <div className="error">{errors.email}</div>}
              </div>
              <button type="submit" className="submit-button">
                Add Student
              </button>
            </form>
          </div>
          <div className="student-table">
            <div className="header">
              <div className="cell">First Name</div>
              <div className="cell">Last Name</div>
              <div className="cell">Email</div>
            </div>
            {currentStudents.map((student, index) => (
              <div key={index} className="row">
                <div className="cell">{student.firstName}</div>
                <div className="cell">{student.lastName}</div>
                <div className="cell">{student.email}</div>
              </div>
            ))}
          </div>
          <div className="pagination">
            {Array.from({ length: Math.ceil(students.length / studentsPerPage) }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`page-button ${currentPage === index + 1 ? 'active-page-button' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardComponent;
