import React, { Component } from 'react'

import data from './Functions/PreDefinedState/State'

import { connect } from 'react-redux'

import { Redirect } from 'react-router-dom'

// import ClipLoader from 'react-spinners/ClipLoader'
import { notification, Button } from 'antd'

import { Icon } from 'react-icons-kit'

import { arrowLeft2 } from 'react-icons-kit/icomoon/arrowLeft2'
import Loader from 'components/LayoutComponents/Loader'
import {
  updateProject,
  getThisProject,
  createProject,
  deleteProject,
} from '../../redux/projects/projectActions'

import HandleSubmit from './Functions/HandleSubmit'
import HandleMarker from './Functions/HandleMarker'

import General from './Views/General'
import Management from './Views/Management'
import Settings from './Views/Settings'

import Modal from 'react-modal'
import Users from './Modal/Users'

import styles from './style.module.css'

// import { toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

class ProjectDetailsView extends Component {
  state = { ...data }

  componentDidMount = () => {
    if (this.props.match.params.id === 'create-project')
      this.setState({
        ...this.state,
        createdby: this.props.profile.Name,
        flag: true,
        viewUser: [],
        pendingRegistrations: [],
      })
    else {
      this.props.getThisProject(this.props.id)
    }
  }

  componentDidUpdate = prevProps => {
    if (this.props.project === prevProps.project) return
    this.setState({ ...this.props.project, viewUser: this.props.viewUser })
  }

  handleEdit = () => {
    let userRole = this.props.project.roles.filter(role =>
      role.usersID.includes(this.props.profile.ID),
    )

    if (userRole[0].projectRule === 'WRITE') this.setState({ ...this.state, flag: true })
    else notification.error({ message: 'You are not Authorized to Edit Project !' })
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value,
    })
  }

  handleSubmit = () => {
    if (
      this.state.name === '' ||
      this.state.city === '' ||
      this.state.street === '' ||
      this.state.zip === '' ||
      this.state.state === '' ||
      this.state.location === '' ||
      this.state.projectDescription === '' ||
      this.state.createdby === ''
    ) {
      alert('Please Fill in All Details')

      return
    }
    HandleSubmit(
      this.state,
      this.props.match,
      this.props.createProject,
      this.props.updateProject,
      this.props.history,
      this.props.profile,
    )

    this.setState({ flag: false })
  }

  handleDeleteProject = () => {
    if (this.props.match.params.id === 'create-project') return
    if (this.props.project.userID === this.props.profile.ID) {
      this.props.deleteProject(this.props.project.ID)
      this.props.history.push('/list')
    }
  }

  handleLatLng = e => {
    this.setState({ ...this.props.state, lat: '', lng: '' })
    this.handleChange(e)
  }

  handleActive = () => {
    this.setState({
      ...this.state,
      active: !this.state.active,
    })
  }

  openModal = () => {
    let userRole = this.props.project.roles.filter(role =>
      role.usersID.includes(this.props.profile.ID),
    )

    if (userRole[0].rolesRule === 'WRITE') this.setState({ ...this.state, isOpen: true })
    else notification.error({ message: 'You are not Authorized to configure Users !' })
  }

  // afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   subtitle.style.color = '#f00';
  // }

  closeModal = () => {
    this.setState({ ...this.state, isOpen: false })
  }

  render() {
    const { auth, profile } = this.props

    if (!auth.uid) return <Redirect to="/signin" />

    if (!profile.isEmpty && this.props.match.params.id !== 'create-project') {
      if (!profile.projects.includes(this.props.id)) return <Redirect to="/dashboard/list" />
    }

    const handleMarker = (lat, lng) => {
      HandleMarker(lat, lng, this.state)
        .then(data =>
          this.setState({
            ...this.state,
            lng,
            lat,
            street: data.street,
            state: data.adminArea3,
            zip: data.postalCode,
            city: data.adminArea5,
            location: `${data.street} ${data.adminArea5}`,
          }),
        )
        .catch(err => console.log(err))
    }

    if (this.props.loading) {
      return <Loader />
    } else
      return (
        <div>
          <div className="dashboard container">
            <div className={styles.projectMainHomeNav}>
              <div
                style={{
                  position: 'absolute',
                  top: '70px',
                  left: '20px',
                  color: '#fbd800',
                }}
                onClick={() => this.props.history.goBack()}
              >
                <Icon size={54} icon={arrowLeft2} />
              </div>

              {this.state.name ? (
                <h4>{`Construction of ${this.state.name}`}</h4>
              ) : (
                <h4>Projects Details</h4>
              )}

              {this.state.flag ? (
                <span>
                  <Button onClick={this.handleSubmit}>
                    {this.props.match.params.id === 'create-project' ? 'Save' : 'Update'}
                  </Button>
                  {/* <Button
                    className="btn-det btn waves-effect"
                    onClick={() => this.props.getThisProject(this.props.id)}
                  >
                    Discard Changes
                  </Button> */}
                </span>
              ) : (
                <span>
                  <Button onClick={this.handleEdit}>Edit</Button>
                </span>
              )}
            </div>
            <hr />
          </div>

          <div className={styles.detailsGridWrapper}>
            <General
              state={this.state}
              handleChange={this.handleChange}
              handleMarker={handleMarker}
              handleLatLng={this.handleLatLng}
            />

            <Management
              state={this.state}
              handleChange={this.handleChange}
              viewUser={this.state.viewUser}
              openModal={this.openModal}
              match={this.props.match}
            />
            <Settings
              state={this.state}
              handleChange={this.handleChange}
              handleActive={this.handleActive}
              deleteProject={this.props.handleDeleteProject}
              match={this.props.match}
            />
          </div>
          <Modal
            isOpen={this.state.isOpen}
            onRequestClose={this.closeModal}
            className={styles.Modal}
            overlayClassName="Overlay"
            shouldCloseOnOverlayClick
          >
            <Users
              closeModal={this.closeModal}
              viewUser={this.state.viewUser}
              pendingRegistrations={this.state.pendingRegistrations}
              userID={this.props.profile.ID}
              projectID={this.props.project.ID}
              roles={this.props.project.roles}
              definedRoles={this.props.project.definedRoles}
            />
          </Modal>
        </div>
      )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    projects: state.project.projects,
    project: state.project.project,
    loading: state.project.loading,
    viewUser: state.project.viewUser,
  }
}

export default connect(mapStateToProps, {
  updateProject,
  getThisProject,
  createProject,
  deleteProject,
})(ProjectDetailsView)
