import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  Box,
  Chip,
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { IconSearch, IconFilter, IconEdit, IconTrash } from '@tabler/icons-react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';
import MainCard from 'ui-component/cards/MainCard';

const RegisteredConferee = () => {
  const [conferees, setConferees] = useState([]);
  const [filteredConferees, setFilteredConferees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedConferee, setSelectedConferee] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const fetchConferees = async () => {
      try {
        const confereeRef = collection(firestore, 'conferee');
        const q = query(confereeRef, where('status', '==', 'approved'));
        const querySnapshot = await getDocs(q);
        
        const confereeData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setConferees(confereeData);
        setFilteredConferees(confereeData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conferees:', error);
        setLoading(false);
      }
    };

    fetchConferees();
  }, []);

  // Add capitalize function
  const capitalize = (str) => {
    if (!str) return '';
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    
    const filtered = conferees.filter(conferee => 
      conferee.name?.toLowerCase().includes(searchValue) ||
      conferee.email?.toLowerCase().includes(searchValue) ||
      conferee.church?.toLowerCase().includes(searchValue) ||
      conferee.organization?.toLowerCase().includes(searchValue) ||
      conferee.gender?.toLowerCase().includes(searchValue) ||
      conferee.sector?.toString().includes(searchValue) ||
      `sector ${conferee.sector}`.toLowerCase().includes(searchValue)
    );
    
    setFilteredConferees(filtered);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (conferee) => {
    setSelectedConferee(conferee);
    setEditFormData(conferee);
    setEditDialog(true);
  };

  const handleDeleteClick = (conferee) => {
    setSelectedConferee(conferee);
    setDeleteDialog(true);
  };

  const handleEditSubmit = async () => {
    try {
      const docRef = doc(firestore, 'conferee', selectedConferee.id);
      await updateDoc(docRef, {
        ...editFormData,
        name: editFormData.name.toLowerCase(),
        church: editFormData.church.toLowerCase(),
        organization: editFormData.organization.toLowerCase(),
        gender: editFormData.gender.toLowerCase(),
      });
      
      // Update local state
      const updatedConferees = conferees.map(c => 
        c.id === selectedConferee.id ? { ...c, ...editFormData } : c
      );
      setConferees(updatedConferees);
      setFilteredConferees(updatedConferees);
      setEditDialog(false);
    } catch (error) {
      console.error('Error updating conferee:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, 'conferee', selectedConferee.id));
      const updatedConferees = conferees.filter(c => c.id !== selectedConferee.id);
      setConferees(updatedConferees);
      setFilteredConferees(updatedConferees);
      setDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting conferee:', error);
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#1e441f'
      },
      '&:hover fieldset': {
        borderColor: '#1e441f'
      }
    },
    '& .MuiInputLabel-root': {
      color: '#1e441f',
      '&.Mui-focused': {
        color: '#1e441f'
      }
    }
  };

  return (
    <MainCard>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3,
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              gap: 2
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 2
              }}>
                <Typography variant="h3" component="h2" sx={{ color: '#1e441f' }}>
                  Registered Conferees
                </Typography>
                <Chip
                  label={`${conferees.length}`}
                  sx={{
                    backgroundColor: '#e8f5e9',
                    color: '#1e441f',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                />
              </Box>
              <TextField
                variant="outlined"
                placeholder="Search any field..."
                value={searchTerm}
                onChange={handleSearch}
                sx={{
                  width: { xs: '100%', md: '300px' },
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#1e441f'
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size="1.2rem" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 280px)' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f3f3f3' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f3f3f3' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f3f3f3' }}>Church</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f3f3f3' }}>Sector</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f3f3f3' }}>Organization</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f3f3f3' }}>Gender</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f3f3f3' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredConferees
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((conferee) => (
                    <TableRow key={conferee.id} hover>
                      <TableCell>{capitalize(conferee.name)}</TableCell>
                      <TableCell>{conferee.email?.toLowerCase()}</TableCell>
                      <TableCell>{capitalize(conferee.church)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`Sector ${conferee.sector}`}
                          size="small"
                          sx={{ 
                            backgroundColor: '#e8f5e9',
                            color: '#1e441f'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={capitalize(conferee.organization)}
                          size="small"
                          sx={{ 
                            backgroundColor: '#1e441f',
                            color: '#fff'
                          }}
                        />
                      </TableCell>
                      <TableCell>{capitalize(conferee.gender)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(conferee)}
                            sx={{ 
                              color: '#1e441f',
                              '&:hover': { bgcolor: '#e8f5e9' }
                            }}
                          >
                            <IconEdit size="1.1rem" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(conferee)}
                            sx={{ 
                              color: 'error.main',
                              '&:hover': { bgcolor: 'error.lighter' }
                            }}
                          >
                            <IconTrash size="1.1rem" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredConferees.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{
                '.MuiTablePagination-select': {
                  color: '#1e441f'
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#1e441f' }}>Edit Conferee Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {['name', 'email', 'church', 'sector', 'organization', 'gender'].map((field) => (
              <Grid 
                item 
                xs={12} 
                md={field === 'name' || field === 'email' ? 12 : 6} 
                key={field}
              >
                {field === 'sector' || field === 'organization' || field === 'gender' ? (
                  <FormControl fullWidth sx={textFieldStyles}>
                    <InputLabel>{capitalize(field)}</InputLabel>
                    <Select
                      value={editFormData[field] || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, [field]: e.target.value })}
                      label={capitalize(field)}
                    >
                      {field === 'sector' ? (
                        Array.from({ length: 10 }, (_, i) => (
                          <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
                        ))
                      ) : field === 'organization' ? (
                        ['junior', 'young people', 'single adult', 'laymen', 'womisso'].map(org => (
                          <MenuItem key={org} value={org}>{capitalize(org)}</MenuItem>
                        ))
                      ) : (
                        ['Male', 'Female'].map(g => (
                          <MenuItem key={g} value={g.toLowerCase()}>{g}</MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    label={capitalize(field)}
                    value={editFormData[field] || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (field === 'name') {
                        // Allow only letters, spaces, and dots for names
                        if (/[^a-zA-Z\s.]/.test(value)) return;
                        // Prevent multiple spaces
                        if (value.includes('  ')) return;
                      }
                      setEditFormData({ ...editFormData, [field]: value });
                    }}
                    error={field === 'name' && (!editFormData[field] || editFormData[field].length < 2)}
                    helperText={
                      field === 'name' && (!editFormData[field] || editFormData[field].length < 2) 
                        ? 'Name must be at least 2 characters long'
                        : ''
                    }
                    InputProps={{
                      readOnly: field === 'email',
                      style: field === 'name' ? { textTransform: 'capitalize' } : {}
                    }}
                    sx={{
                      ...textFieldStyles,
                      '& .MuiOutlinedInput-root': {
                        ...textFieldStyles['& .MuiOutlinedInput-root'],
                        backgroundColor: field === 'email' ? '#f5f5f5' : 'inherit'
                      }
                    }}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleEditSubmit}
            variant="contained"
            disabled={!editFormData.name || editFormData.name.length < 2}
            sx={{ 
              bgcolor: '#1e441f', 
              '&:hover': { bgcolor: '#2e682f' },
              '&.Mui-disabled': {
                bgcolor: 'rgba(30, 68, 31, 0.5)'
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle sx={{ color: 'error.main' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedConferee?.name ? capitalize(selectedConferee.name) : 'this conferee'}?
          This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default RegisteredConferee;
