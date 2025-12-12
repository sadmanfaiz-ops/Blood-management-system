// Bangladesh regions with their coordinates
const REGION_COORDINATES = {
  // Major Dhaka Division cities
  'dhaka': { latitude: 23.8103, longitude: 90.4125 },
  'dacca': { latitude: 23.8103, longitude: 90.4125 },
  'gulshan': { latitude: 23.8103, longitude: 90.4269 },
  'banani': { latitude: 23.8319, longitude: 90.4143 },
  'uttara': { latitude: 23.8730, longitude: 90.3990 },
  'dhanmondi': { latitude: 23.7460, longitude: 90.3835 },
  'motijheel': { latitude: 23.7735, longitude: 90.4050 },
  'mirpur': { latitude: 23.8200, longitude: 90.3600 },
  'narayanganj': { latitude: 23.7036, longitude: 90.5000 },
  'gazipur': { latitude: 24.0000, longitude: 90.4167 },
  'tangail': { latitude: 24.2500, longitude: 89.9167 },
  'mymensingh': { latitude: 24.7471, longitude: 90.4203 },
  
  // Chattogram Division cities
  'chattogram': { latitude: 22.3569, longitude: 91.7832 },
  'chittagong': { latitude: 22.3569, longitude: 91.7832 },
  'ctg': { latitude: 22.3569, longitude: 91.7832 },
  'cox\'s bazar': { latitude: 21.4435, longitude: 91.9813 },
  'cox bazar': { latitude: 21.4435, longitude: 91.9813 },
  'sylhet': { latitude: 24.8949, longitude: 91.8687 },
  'khulna': { latitude: 22.8456, longitude: 89.5600 },
  'barisal': { latitude: 22.7010, longitude: 90.3535 },
  'barishal': { latitude: 22.7010, longitude: 90.3535 },
  'patuakhali': { latitude: 22.2539, longitude: 90.3295 },
  'feni': { latitude: 23.0159, longitude: 91.3976 },
  'noakhali': { latitude: 22.8268, longitude: 91.0988 },
  'comilla': { latitude: 23.4607, longitude: 91.1809 },
  'cumilla': { latitude: 23.4607, longitude: 91.1809 },
  
  // Rajshahi Division cities
  'rajshahi': { latitude: 24.3745, longitude: 88.6042 },
  'bogra': { latitude: 24.8949, longitude: 89.3775 },
  'bogura': { latitude: 24.8949, longitude: 89.3775 },
  'pabna': { latitude: 23.9999, longitude: 89.2333 },
  'dinajpur': { latitude: 25.6217, longitude: 88.6348 },
  'rangpur': { latitude: 25.7479, longitude: 89.2500 },
  'thakurgaon': { latitude: 26.2168, longitude: 88.4615 },
  'panchagarh': { latitude: 26.6336, longitude: 88.5541 },
  
  // Others
  'jashore': { latitude: 23.1645, longitude: 89.2081 },
  'jessore': { latitude: 23.1645, longitude: 89.2081 },
  'bagerhat': { latitude: 22.6515, longitude: 89.7860 },
  'pirojpur': { latitude: 22.5644, longitude: 90.0969 },
  'jhalokati': { latitude: 22.6384, longitude: 90.1987 },
  'gopalganj': { latitude: 23.0050, longitude: 90.7700 },
  'madaripur': { latitude: 23.1945, longitude: 90.1847 },
  'shariatpur': { latitude: 23.2418, longitude: 90.4313 },
  'munshiganj': { latitude: 23.5456, longitude: 90.5333 },
  'manikganj': { latitude: 23.8636, longitude: 90.0050 },
  'pitukhali': { latitude: 22.2539, longitude: 90.3295 }
};

/**
 * Get coordinates for a given region name
 * @param {string} region - Region name (case-insensitive)
 * @returns {object|null} { latitude, longitude } or null if not found
 */
function getCoordinatesByRegion(region) {
  if (!region || typeof region !== 'string') {
    return null;
  }
  
  const normalizedRegion = region.toLowerCase().trim();
  return REGION_COORDINATES[normalizedRegion] || null;
}

/**
 * Get all available regions
 * @returns {array} List of supported region names
 */
function getAvailableRegions() {
  return Object.keys(REGION_COORDINATES).sort();
}

/**
 * Check if a region is supported
 * @param {string} region - Region name
 * @returns {boolean}
 */
function isValidRegion(region) {
  return getCoordinatesByRegion(region) !== null;
}

module.exports = {
  getCoordinatesByRegion,
  getAvailableRegions,
  isValidRegion,
  REGION_COORDINATES
};
