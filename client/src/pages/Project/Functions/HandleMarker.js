import axios from 'axios'
const HandleMarker = (lat, lng, state) => {
  return new Promise((resolve, reject) => {
    if (!state.flag) reject({ msg: 'not Authorized' })
    else if (state.flag)
      axios
        .get(
          `https://open.mapquestapi.com/geocoding/v1/reverse?key=8BMAbnYiw1lNi8wGGywrZzYwkoT3SrwT&location=${lat},${lng}&includeRoadMetadata=true&includeNearestIntersection=true`,
        )
        .then(res => {
          if (res.data.results[0] === undefined) return
          const { street, adminArea3, postalCode, adminArea5 } = res.data.results[0].locations[0]
          resolve({ street, adminArea3, postalCode, adminArea5 })
        })
  })
}

export default HandleMarker
