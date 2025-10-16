import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  Chip,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Özel marker iconları
const currentLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const turkeyLocations = [
  { id: 1, name: 'Edirne Merkez', lat: 41.6818, lng: 26.5623, address: 'Merkez, Edirne', city: 'Edirne', priority: 1 },
  { id: 2, name: 'Selimiye Camii Çevresi', lat: 41.6777, lng: 26.5681, address: 'Selimiye, Edirne', city: 'Edirne', priority: 1 },
  
  { id: 3, name: 'Kadıköy Merkez', lat: 40.9904, lng: 29.0267, address: 'Kadıköy, İstanbul', city: 'İstanbul', priority: 2 },
  { id: 4, name: 'Beşiktaş Çarşı', lat: 41.0422, lng: 29.0067, address: 'Beşiktaş, İstanbul', city: 'İstanbul', priority: 2 },
  { id: 5, name: 'Taksim Meydanı', lat: 41.0369, lng: 28.9857, address: 'Taksim, İstanbul', city: 'İstanbul', priority: 2 },
  { id: 6, name: 'Eminönü', lat: 41.0172, lng: 28.9700, address: 'Eminönü, İstanbul', city: 'İstanbul', priority: 2 },
  { id: 7, name: 'Şişli', lat: 41.0605, lng: 28.9867, address: 'Şişli, İstanbul', city: 'İstanbul', priority: 2 },
  { id: 8, name: 'Üsküdar', lat: 41.0214, lng: 29.0158, address: 'Üsküdar, İstanbul', city: 'İstanbul', priority: 2 },
  
  { id: 9, name: 'Balıkesir Merkez', lat: 39.6484, lng: 27.8826, address: 'Merkez, Balıkesir', city: 'Balıkesir', priority: 3 },
  { id: 10, name: 'Ayvalık', lat: 39.3167, lng: 26.6833, address: 'Ayvalık, Balıkesir', city: 'Balıkesir', priority: 3 },
  { id: 11, name: 'Bandırma', lat: 40.3520, lng: 27.9773, address: 'Bandırma, Balıkesir', city: 'Balıkesir', priority: 3 },
  { id: 12, name: 'Edremit', lat: 39.5952, lng: 27.0254, address: 'Edremit, Balıkesir', city: 'Balıkesir', priority: 3 },
  
  { id: 13, name: 'Konak', lat: 38.4237, lng: 27.1428, address: 'Konak, İzmir', city: 'İzmir', priority: 4 },
  { id: 14, name: 'Alsancak', lat: 38.4392, lng: 27.1470, address: 'Alsancak, İzmir', city: 'İzmir', priority: 4 },
  { id: 15, name: 'Karşıyaka', lat: 38.4618, lng: 27.1278, address: 'Karşıyaka, İzmir', city: 'İzmir', priority: 4 },
  { id: 16, name: 'Bornova', lat: 38.4697, lng: 27.2167, address: 'Bornova, İzmir', city: 'İzmir', priority: 4 },
 
  { id: 17, name: 'Kızılay', lat: 39.9208, lng: 32.8541, address: 'Kızılay, Ankara', city: 'Ankara', priority: 5 },
  { id: 18, name: 'Ulus', lat: 39.9388, lng: 32.8543, address: 'Ulus, Ankara', city: 'Ankara', priority: 5 },
  
  { id: 19, name: 'Kaleiçi', lat: 36.8841, lng: 30.7056, address: 'Kaleiçi, Antalya', city: 'Antalya', priority: 6 },
  { id: 20, name: 'Lara', lat: 36.8333, lng: 30.7833, address: 'Lara, Antalya', city: 'Antalya', priority: 6 },
  
  { id: 21, name: 'Çanakkale Merkez', lat: 40.1553, lng: 26.4142, address: 'Merkez, Çanakkale', city: 'Çanakkale', priority: 7 },
  { id: 22, name: 'Çanakkale Kordon', lat: 40.1467, lng: 26.4067, address: 'Kordon, Çanakkale', city: 'Çanakkale', priority: 7 },
  { id: 23, name: 'Gelibolu', lat: 40.4167, lng: 26.6667, address: 'Gelibolu, Çanakkale', city: 'Çanakkale', priority: 7 },
  
  { id: 24, name: 'Tekirdağ Merkez', lat: 40.9833, lng: 27.5167, address: 'Merkez, Tekirdağ', city: 'Tekirdağ', priority: 8 },
  { id: 25, name: 'Tekirdağ Sahil', lat: 40.9789, lng: 27.5111, address: 'Sahil, Tekirdağ', city: 'Tekirdağ', priority: 8 },
  { id: 26, name: 'Çorlu', lat: 41.1597, lng: 27.8000, address: 'Çorlu, Tekirdağ', city: 'Tekirdağ', priority: 8 },
];

// Harita üzerinde tıklama olaylarını dinleyen component
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
    
      const newLocation = {
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
        address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
        name: 'Seçilen Konum'
      };
      
      onLocationSelect(newLocation);
    }
  });
  
  return null;
}

function LocationPicker({ value, onChange, label = "Konum Seç", required = false }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(value || null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 39.9334, lng: 32.8597 });
  const [filteredLocations, setFilteredLocations] = useState(turkeyLocations);
  const [mapZoom, setMapZoom] = useState(6);
  const mapRef = useRef(null);

  useEffect(() => {
    if (searchQuery) {
      const filtered = turkeyLocations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(turkeyLocations);
    }
  }, [searchQuery]);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = {
            lat: latitude,
            lng: longitude,
            address: 'Mevcut Konumunuz',
            name: 'Mevcut Konum'
          };
          setCurrentLocation(newLocation);
          setMapCenter({ lat: latitude, lng: longitude });
          setMapZoom(15); 
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Konum alınamadı:', error);
          setIsGettingLocation(false);
          alert('Konum bilgisi alınamadı. Lütfen tarayıcınızın konum erişimine izin verdiğinizden emin olun.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setIsGettingLocation(false);
      alert('Tarayıcınız konum servislerini desteklemiyor.');
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setMapCenter({ lat: location.lat, lng: location.lng });
    setMapZoom(16);
  };

  const handleConfirm = () => {
    if (selectedLocation && onChange) {
      onChange({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address: selectedLocation.address,
        name: selectedLocation.name
      });
    }
    setOpen(false);
  };

  const resetMap = () => {
    setMapCenter({ lat: 39.9334, lng: 32.8597 });
    setMapZoom(6); 
    setSelectedLocation(null);
    setCurrentLocation(null);
    setSearchQuery('');
  };

  return (
    <>
      <TextField
        fullWidth
        label={label}
        placeholder="Konum seçmek için tıklayın"
        value={value ? `${value.name} - ${value.address}` : ''}
        onClick={() => setOpen(true)}
        required={required}
        InputProps={{
          readOnly: true,
          startAdornment: <LocationIcon sx={{ color: 'primary.main', mr: 1 }} />,
          endAdornment: (
            <IconButton onClick={() => setOpen(true)} size="small">
              <MapIcon />
            </IconButton>
          ),
        }}
        sx={{ cursor: 'pointer' }}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: '80vh' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Konum Seç</Typography>
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Konum ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
            />
            <Button
              variant="outlined"
              startIcon={isGettingLocation ? <CircularProgress size={20} /> : <MyLocationIcon />}
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              sx={{ minWidth: 'max-content', whiteSpace: 'nowrap' }}
            >
              {isGettingLocation ? 'Alınıyor...' : 'Mevcut Konum'}
            </Button>
            <Button
              variant="outlined"
              onClick={resetMap}
              sx={{ minWidth: 'max-content' }}
            >
              Sıfırla
            </Button>
          </Box>

            {currentLocation && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Mevcut konumunuz alındı. Aşağıdaki haritadan veya listeden seçim yapabilirsiniz.
              </Alert>
            )}
          </Box>

          <Box sx={{ display: 'flex', height: 'calc(80vh - 200px)' }}>
            {/* OpenStreetMap Harita Alanı */}
            <Box sx={{ flex: 1, position: 'relative', borderRight: 1, borderColor: 'divider' }}>
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                key={`${mapCenter.lat}-${mapCenter.lng}-${mapZoom}`}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <MapClickHandler onLocationSelect={handleLocationSelect} />
                
                {currentLocation && (
                  <Marker 
                    position={[currentLocation.lat, currentLocation.lng]}
                    icon={currentLocationIcon}
                  >
                    <Popup>
                      <strong>Mevcut Konumunuz</strong><br />
                      {currentLocation.address}
                    </Popup>
                  </Marker>
                )}
                
                {/* Seçilen konum marker'ı */}
                {selectedLocation && (
                  <Marker 
                    position={[selectedLocation.lat, selectedLocation.lng]}
                    icon={selectedLocationIcon}
                  >
                    <Popup>
                      <strong>{selectedLocation.name}</strong><br />
                      {selectedLocation.address}
                    </Popup>
                  </Marker>
                )}
                
                {filteredLocations.map((location) => (
                  <Marker
                    key={location.id}
                    position={[location.lat, location.lng]}
                    eventHandlers={{
                      click: () => handleLocationSelect(location),
                    }}
                  >
                    <Popup>
                      <strong>{location.name}</strong><br />
                      {location.address}<br />
                      <Button 
                        size="small" 
                        onClick={() => handleLocationSelect(location)}
                        sx={{ mt: 1 }}
                      >
                        Bu Konumu Seç
                      </Button>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {selectedLocation && (
                <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 1000 }}>
                  <Chip
                    label={`📍 ${selectedLocation.name} - ${selectedLocation.address}`}
                    color="primary"
                    variant="filled"
                    sx={{ 
                      maxWidth: '100%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              )}
            </Box>

            <Box sx={{ width: 350, p: 2, overflowY: 'auto' }}>
              <Typography variant="subtitle2" gutterBottom>
                Popüler Konumlar ({filteredLocations.length})
              </Typography>

              {currentLocation && (
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    cursor: 'pointer',
                    border: selectedLocation?.name === 'Mevcut Konum' ? 2 : 1,
                    borderColor: selectedLocation?.name === 'Mevcut Konum' ? 'primary.main' : 'divider',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => handleLocationSelect(currentLocation)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MyLocationIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2">Mevcut Konum</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {currentLocation.address}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              {Object.entries(
                filteredLocations.reduce((acc, location) => {
                  if (!acc[location.city]) {
                    acc[location.city] = {
                      locations: [],
                      priority: location.priority
                    };
                  }
                  acc[location.city].locations.push(location);
                  return acc;
                }, {})
              )
              .sort(([, a], [, b]) => a.priority - b.priority)
              .map(([city, { locations }]) => (
                <Box key={city} sx={{ mb: 2 }}>
                  <Typography 
                    variant="overline" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: city === 'Edirne' ? 'secondary.main' : 'primary.main',
                      display: 'block',
                      mb: 1,
                      fontSize: city === 'Edirne' ? '0.85rem' : '0.75rem'
                    }}
                  >
                    {city === 'Edirne' ? '⭐ ' : ''}{city} ({locations.length})
                  </Typography>
                  
                  {locations.map((location) => (
                    <Paper
                      key={location.id}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        cursor: 'pointer',
                        border: selectedLocation?.id === location.id ? 2 : 1,
                        borderColor: selectedLocation?.id === location.id ? 'primary.main' : 'divider',
                        '&:hover': { bgcolor: 'action.hover' },
                        ml: 1, 
                        bgcolor: city === 'Edirne' ? 'secondary.50' : 'background.paper'
                      }}
                      onClick={() => handleLocationSelect(location)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon 
                          sx={{ 
                            color: selectedLocation?.id === location.id ? 'primary.main' : 
                                   city === 'Edirne' ? 'secondary.main' : 'action.active',
                            fontSize: 18
                          }} 
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: city === 'Edirne' ? 'bold' : 'medium',
                              color: city === 'Edirne' ? 'secondary.dark' : 'text.primary'
                            }}
                          >
                            {location.name === 'Edirne Merkez' ? '🏆 ' : ''}{location.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {location.address}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ))}

              {filteredLocations.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  Aramanıza uygun konum bulunamadı.
                  <br />
                  <Typography variant="caption">
                    Şehir adı, bölge adı veya konum adı ile arama yapabilirsiniz.
                  </Typography>
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!selectedLocation}
          >
            Konumu Seç
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LocationPicker;