export const getDistance = (lat1, lng1, lat2, lng2) => {
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
  }

  const R = 6371e3
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distanceInMeters = R * c

  return distanceInMeters.toFixed(0)
}
