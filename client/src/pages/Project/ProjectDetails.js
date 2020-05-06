import React, { Component } from 'react'

import { connect } from 'react-redux'

import { Redirect } from 'react-router-dom'

import ProjectDetailsView from './ProjectDetailsView'

class ProjectDetails extends Component {
  render() {
    const { auth } = this.props
    if (!auth.uid) return <Redirect to="/user/login" />

    return <ProjectDetailsView id={this.props.match.params.id} {...this.props} />
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    projects: state.project.projects,
  }
}

export default connect(mapStateToProps)(ProjectDetails)
