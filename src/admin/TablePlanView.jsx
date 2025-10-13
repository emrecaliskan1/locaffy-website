import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Group as GroupIcon,
} from '@mui/icons-material';

// Mock data - gerçek uygulamada API'den gelecek
const mockTables = [
  { id: 1, number: 'A01', capacity: 2, status: 'Boş', x: 1, y: 1 },
  { id: 2, number: 'A02', capacity: 4, status: 'Dolu', x: 2, y: 1 },
  { id: 3, number: 'A03', capacity: 2, status: 'Rezerve', x: 3, y: 1 },
  { id: 4, number: 'A04', capacity: 6, status: 'Temizlenmeli', x: 4, y: 1 },
  { id: 5, number: 'B01', capacity: 4, status: 'Boş', x: 1, y: 2 },
  { id: 6, number: 'B02', capacity: 8, status: 'Dolu', x: 2, y: 2 },
  { id: 7, number: 'B03', capacity: 2, status: 'Boş', x: 3, y: 2 },
  { id: 8, number: 'B04', capacity: 4, status: 'Rezerve', x: 4, y: 2 },
  { id: 9, number: 'C01', capacity: 6, status: 'Boş', x: 1, y: 3 },
  { id: 10, number: 'C02', capacity: 10, status: 'Dolu', x: 2, y: 3 },
  { id: 11, number: 'C03', capacity: 4, status: 'Boş', x: 3, y: 3 },
  { id: 12, number: 'C04', capacity: 2, status: 'Temizlenmeli', x: 4, y: 3 },
];

const statusColors = {
  'Boş': 'success',
  'Dolu': 'error',
  'Rezerve': 'warning',
  'Temizlenmeli': 'info',
};

const statusOptions = ['Boş', 'Dolu', 'Rezerve', 'Temizlenmeli'];

const TableCard = ({ table, onStatusChange, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Boş':
        return '#4caf50';
      case 'Dolu':
        return '#f44336';
      case 'Rezerve':
        return '#ff9800';
      case 'Temizlenmeli':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <Card
      sx={{
        height: 120,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: `2px solid ${getStatusColor(table.status)}`,
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 4,
        },
      }}
      onClick={() => onStatusChange(table)}
    >
      <CardContent sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {table.number}
          </Typography>
          <Box>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onEdit(table); }}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(table); }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {table.capacity <= 4 ? <PersonIcon fontSize="small" /> : <GroupIcon fontSize="small" />}
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {table.capacity} kişi
            </Typography>
          </Box>
          <Chip
            label={table.status}
            size="small"
            sx={{
              backgroundColor: getStatusColor(table.status),
              color: 'white',
              fontSize: '0.7rem',
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

function TablePlanView() {
  const [tables, setTables] = useState(mockTables);
  const [selectedTable, setSelectedTable] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [addTableDialogOpen, setAddTableDialogOpen] = useState(false);
  const [newTable, setNewTable] = useState({
    number: '',
    capacity: 2,
    status: 'Boş',
  });

  const handleStatusChange = (table) => {
    setSelectedTable(table);
    setNewStatus(table.status);
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    if (selectedTable) {
      setTables(prev => prev.map(table => 
        table.id === selectedTable.id 
          ? { ...table, status: newStatus }
          : table
      ));
      setStatusDialogOpen(false);
      setSelectedTable(null);
    }
  };

  const handleAddTable = () => {
    const newId = Math.max(...tables.map(t => t.id)) + 1;
    const newPosition = {
      x: (tables.length % 4) + 1,
      y: Math.floor(tables.length / 4) + 1,
    };
    
    setTables(prev => [...prev, {
      id: newId,
      ...newTable,
      ...newPosition,
    }]);
    
    setAddTableDialogOpen(false);
    setNewTable({ number: '', capacity: 2, status: 'Boş' });
  };

  const handleDeleteTable = (table) => {
    setTables(prev => prev.filter(t => t.id !== table.id));
  };

  const getTableStats = () => {
    const total = tables.length;
    const empty = tables.filter(t => t.status === 'Boş').length;
    const occupied = tables.filter(t => t.status === 'Dolu').length;
    const reserved = tables.filter(t => t.status === 'Rezerve').length;
    const cleaning = tables.filter(t => t.status === 'Temizlenmeli').length;
    
    return { total, empty, occupied, reserved, cleaning };
  };

  const stats = getTableStats();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Masa Planı ve Yönetimi
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddTableDialogOpen(true)}
        >
          Masa Ekle
        </Button>
      </Box>

      {/* İstatistikler */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Toplam Masa
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {stats.empty}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Boş Masa
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {stats.occupied}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dolu Masa
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {stats.reserved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rezerve Masa
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {stats.cleaning}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Temizlenmeli
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Masa Planı */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          Restoran Kat Planı
        </Typography>
        <Grid container spacing={2}>
          {tables.map((table) => (
            <Grid item xs={12} sm={6} md={3} key={table.id}>
              <TableCard
                table={table}
                onStatusChange={handleStatusChange}
                onEdit={(table) => console.log('Edit table:', table)}
                onDelete={handleDeleteTable}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Durum Değiştirme Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Masa Durumu Değiştir</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {selectedTable?.number} masasının durumunu değiştirin:
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Yeni Durum</InputLabel>
            <Select
              value={newStatus}
              label="Yeni Durum"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  <Chip
                    label={status}
                    size="small"
                    sx={{
                      backgroundColor: statusColors[status] ? `${statusColors[status]}.main` : 'grey.500',
                      color: 'white',
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>İptal</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Güncelle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Masa Ekleme Dialog */}
      <Dialog open={addTableDialogOpen} onClose={() => setAddTableDialogOpen(false)}>
        <DialogTitle>Yeni Masa Ekle</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Masa Numarası"
            value={newTable.number}
            onChange={(e) => setNewTable(prev => ({ ...prev, number: e.target.value }))}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Kapasite"
            type="number"
            value={newTable.capacity}
            onChange={(e) => setNewTable(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
            margin="normal"
            inputProps={{ min: 1, max: 20 }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Başlangıç Durumu</InputLabel>
            <Select
              value={newTable.status}
              label="Başlangıç Durumu"
              onChange={(e) => setNewTable(prev => ({ ...prev, status: e.target.value }))}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTableDialogOpen(false)}>İptal</Button>
          <Button onClick={handleAddTable} variant="contained">
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TablePlanView;

