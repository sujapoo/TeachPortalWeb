import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../Services/AuthService';
import { api } from '../../Services/api';
import { validateLength, validateEmail } from '../../Validation/validation';
import './Dashboard.css';
import Layout from '../../Components/Layout';
import '../../Components/Layout.css';


function getTeacherIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    
    return Number(
      json.teacherId ??
      json.tid ??
      json.nameid ??
      json.sub ??
      json['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
    );
  } catch {
    return null;
  }
}

const DashboardComponent = () => {
  const navigate = useNavigate();
  
  const [authChecked, setAuthChecked] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [errors,    setErrors]    = useState({});

  const [query, setQuery]       = useState('');
  const [sortBy, setSortBy]     = useState('firstName'); 
  const [sortDir, setSortDir]   = useState('asc');       
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const check = async () => {
      if (!AuthService.isAuthenticated()) {
        navigate('/login');
        return;
      }
      setAuthChecked(true);
      await fetchStudents();
    };
    check();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);      
      const { data } = await api.get('/students');
      setStudents(Array.isArray(data) ? data : []);
      setError('');
    } catch (e) {
      console.error('Error fetching students:', e);
      const msg = e?.response?.data?.message || e?.response?.data || 'Could not load students. Please try again.';
      setError(typeof msg === 'string' ? msg : 'Could not load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const v = {};
    v.firstName = validateLength(firstName, 2, 50);
    v.lastName  = validateLength(lastName,  2, 50);
    v.email     = validateEmail(email);
    setErrors(v);
    return Object.values(v).every((e) => !e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const teacherId = getTeacherIdFromToken();
    if (!teacherId || Number.isNaN(teacherId)) {
      setError('Could not determine teacher ID from your login. Please sign in again.');
      return;
    }

    const newStudent = {
      firstName: firstName.trim(),
      lastName : lastName.trim(),
      email    : email.trim(),      
      
    };

    try {
      setSaving(true);
      const res = await api.post('/students', newStudent, {
        headers: { 'Content-Type': 'application/json' }
      });
      const created = res?.data ?? newStudent; 
      setStudents((prev) => [created, ...prev]);
      setFirstName(''); setLastName(''); setEmail('');
      setErrors({}); setError('');
    } catch (err) {
      console.error('POST /students failed', err?.response?.data);
  const pd = err?.response?.data;
  const msg =
    pd?.errors ? Object.entries(pd.errors).map(([k,v]) => `${k}: ${v.join(', ')}`).join(' | ')
               : pd?.message || 'Could not add student. Please try again.';
  setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const toggleSort = (col) => {
    if (col === sortBy) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortDir('asc'); }
  };
  
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? students.filter((s) =>
          [s.firstName, s.lastName, s.email]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
        )
      : students;

    const sorted = [...base].sort((a, b) => {
      const av = (a?.[sortBy] ?? '').toString().toLowerCase();
      const bv = (b?.[sortBy] ?? '').toString().toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });
    return sorted;
  }, [students, query, sortBy, sortDir]);

 
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const indexOfLast  = page * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentStudents = filtered.slice(indexOfFirst, indexOfLast);

  useEffect(() => { setCurrentPage(1); }, [query, pageSize]);

  if (!authChecked) return <div className="dashboard-container">Loading…</div>;

  return (
    <Layout>
      <div className="dashboard-container">
         <h2 className="tov2-title">Dashboard</h2>
        {/* Add student */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Add New Student</div>
              <div className="card-subtitle">Create a student with first name, last name, and email.</div>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="form">
              <div className="form-row">
                <div className="form-group">
                  <label className="label" htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`input ${errors.firstName ? 'input-error' : ''}`}
                  />
                  {errors.firstName && <div className="error">{errors.firstName}</div>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`input ${errors.lastName ? 'input-error' : ''}`}
                  />
                  {errors.lastName && <div className="error">{errors.lastName}</div>}
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`input ${errors.email ? 'input-error' : ''}`}
                  />
                  {errors.email && <div className="error">{errors.email}</div>}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Adding…' : 'Add Student'}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => { setFirstName(''); setLastName(''); setEmail(''); setErrors({}); }}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Students table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Students</div>
            <div className="card-tools">
              <input
                className="search-input"
                placeholder="Search by name or email…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select
                className="select"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n} / page</option>
                ))}
              </select>
              <button className="btn" onClick={fetchStudents}>Refresh</button>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="loading">Loading students…</div>
            ) : error ? (
              <div className="alert">{error}</div>
            ) : currentStudents.length === 0 ? (
              <div className="empty">No students to display.</div>
            ) : (
              <div className="table-wrap">
                <table className="table student-table">
                  <thead>
                    <tr>
                      <th onClick={() => toggleSort('firstName')} className="th-sort">
                        First Name {sortBy === 'firstName' && (
                          <span className="sort-ind">{sortDir === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </th>
                      <th onClick={() => toggleSort('lastName')} className="th-sort">
                        Last Name {sortBy === 'lastName' && (
                          <span className="sort-ind">{sortDir === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </th>
                      <th onClick={() => toggleSort('email')} className="th-sort">
                        Email {sortBy === 'email' && (
                          <span className="sort-ind">{sortDir === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStudents.map((s, i) => (
                      <tr key={i}>
                        <td>{s.firstName}</td>
                        <td>{s.lastName}</td>
                        <td>{s.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <span className="muted">
              Page <b>{page}</b> of <b>{totalPages}</b>
            </span>
            <div>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="page-button"
                disabled={page === 1}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                .slice(Math.max(0, page - 3), Math.max(0, page - 3) + 5)
                .map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`page-button ${page === n ? 'active-page-button' : ''}`}
                  >
                    {n}
                  </button>
                ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="page-button"
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardComponent;
