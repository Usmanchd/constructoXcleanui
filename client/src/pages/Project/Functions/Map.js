import React, { Component } from 'react'

import axios from 'axios'
import GoogleMapReact from 'google-map-react'
import { Icon } from 'react-icons-kit'
import { location } from 'react-icons-kit/icomoon/location'
import firebase from '../../../config/fbConfig'
const remoteConfig = firebase.remoteConfig()

const Marker = ({ text }) => (
  <div style={{ width: 24, height: 24, color: 'red' }}>
    <Icon
      size={'100%'}
      icon={location}
      style={{ position: 'relative', top: '-22px', right: '13px' }}
    />
  </div>
)

class Map extends Component {
  componentWillMount = () => {
    remoteConfig
      .fetchAndActivate()
      .then(() => {
        const key = remoteConfig.getValue('GOOGLE_MAP_KEY')
        this.setState({
          ...this.state,
          key: key._value,
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.location === '' && (nextProps.lat === '' || nextProps.lng === '')) return
    else if (nextProps.lat) {
      this.setState({
        ...this.state,
        center: { lat: nextProps.lat, lng: nextProps.lng },
        loading: false,
        lat: nextProps.lat,
        lng: nextProps.lng,
      })
      return
    } else if (this.props.location === nextProps.location) {
      this.setState({
        ...this.state,
        // center: { lat, lng },
        loading: false,
        lat: nextProps.lat,
        lng: nextProps.lng,
      })
      return
    } else {
      const loc = nextProps.location

      axios({
        method: 'GET',
        url: 'https://open.mapquestapi.com/geocoding/v1/address',
        params: { key: '8BMAbnYiw1lNi8wGGywrZzYwkoT3SrwT', location: loc },
      }).then(res => {
        if (res.data.results[0] === undefined) return
        const { lat, lng } = res.data.results[0].locations[0].latLng

        this.setState({
          ...this.state,
          center: { lat, lng },
          loading: false,
          lat,
          lng,
        })
      })
    }
  }

  state = {
    lng: null,
    lat: null,
    center: {
      lng: 74.326297,
      lat: 31.519582,
    },
    dcenter: {
      lng: 74.326297,
      lat: 31.519582,
    },

    zoom: 14,
    loading: false,
    key: null,
    location: '',
  }

  render() {
    const mapOptions = {
      fullscreenControl: false,
    }
    // if (!this.state.key) return <p>loading</p>;
    return (
      <div style={{ height: '280px', width: '100%' }}>
        {this.state.loading ? (
          'loading'
        ) : (
          <GoogleMapReact
            bootstrapURLKeys={{
              key:
                process.env.REACT_APP_GOOGLE_MAP_KEY || 'AIzaSyDvqSD7IVx8FkmKJ7kpHyxZzKpJ2HARMBw',
            }}
            defaultCenter={this.state.dcenter}
            center={this.state.center}
            defaultZoom={this.state.zoom}
            onClick={({ lat, lng }) => this.props.handleMarker(lat, lng)}
            options={mapOptions}
          >
            <Marker lat={this.state.lat} lng={this.state.lng} text="My Marker" />
          </GoogleMapReact>
        )}
      </div>
    )
  }
}
export default Map
