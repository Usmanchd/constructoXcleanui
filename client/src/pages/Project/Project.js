import React, { Component } from 'react'

import { connect } from 'react-redux'

import { Redirect, Link } from 'react-router-dom'
import { Button } from 'antd'
// import ClipLoader from 'react-spinners/ClipLoader'

import { getAllProjects } from '../../redux/projects/projectActions'

import Loader from 'components/LayoutComponents/Loader'

import styles from './style.module.css'

class Project extends Component {
  componentDidMount = () => {
    this.getProject()
  }

  getProject = () => {
    const { getAllProjects } = this.props
    if (this.props.profile.ID === undefined) {
      setTimeout(() => {
        this.getProject()
      }, 10)
    } else {
      getAllProjects(this.props.profile.ID)
    }
  }

  render() {
    const { auth, loading, profile, project } = this.props
    if (!auth.uid) return <Redirect to="/user/login" />
    if (loading || profile.isEmpty) {
      return <Loader />
    } else
      return (
        <div className="dashboard container" style={{ height: '100vh' }}>
          <div className={styles.projectMainHomeNav}>
            <h3>Home</h3>
            <Link to="/dashboard/list">
              <Button>View All Projects</Button>
            </Link>
          </div>
          <hr />
          <div className={styles.projectMainHome}>
            <div className={styles.projectMainHeading}>
              <h4>Current Project Info</h4>
            </div>
            {Object.keys(this.props.project).length !== 0 ? (
              <div className={styles.projectMainSubdetails}>
                <span>{project.name}</span>
                <span>{project.street}</span>
                <span>{project.city}</span>
                <Link to={`/dashboard/project-details/${project.ID}`}>
                  <Button>Detail</Button>
                </Link>
              </div>
            ) : (
              <div className={styles.projectMainSubdetails}>
                <h5>No Record Found!</h5>
              </div>
            )}
          </div>
        </div>
      )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    project: state.project.currentProject,
    profile: state.firebase.profile,
    loading: state.project.loading,
  }
}

export default connect(mapStateToProps, { getAllProjects })(Project)
