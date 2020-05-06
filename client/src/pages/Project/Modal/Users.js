import React, { Component } from 'react'
import Modal from 'react-modal'
import Roles from './Roles'
import { connect } from 'react-redux'
import Dropdown from 'react-dropdown'
import { Input, Button } from 'antd'
import styles from '../style.module.css'
import 'react-dropdown/style.css'
import {
  handleAddUser,
  changeUserRole,
  deleteUserFromProject,
  deleteEmailFromPenReg,
} from '../../../redux/projects/projectActions'
import { Icon } from 'react-icons-kit'
import { cross } from 'react-icons-kit/icomoon/cross'

// const options = [
//   { value: 'chocolate', label: 'Chocolate' },
//   { value: 'strawberry', label: 'Strawberry' },
//   { value: 'vanilla', label: 'Vanilla' },
// ];

class Users extends Component {
  componentDidMount = () => {
    this.setState({
      ...this.state,
      user: this.props.viewUser.map(u => {
        return {
          uservalue: { ...u },
          selectedOption: this.getRole(u),
        }
      }),
      options: this.getOptions(),
    })
  }

  // componentDidUpdate = (pervProps) => {
  //   if (this.props !== pervProps) {
  //     this.setState({
  //       ...this.state,
  //       user: this.props.viewUser.map((u) => {
  //         return {
  //           uservalue: { ...u },
  //           selectedOption: this.getRole(u),
  //         };
  //       }),
  //       options: this.getOptions(),
  //     });
  //   }
  // };

  getRole = user => {
    let u = this.props.roles.filter(role => role.usersID.includes(user.ID))

    if (u[0]) return u[0].roleName
    else return null
  }

  getOptions = () => {
    let uniqueNames = []
    this.props.roles.map(role => uniqueNames.push(role.roleName))

    let option = uniqueNames.map(un => {
      return {
        value: un,
        label: un,
      }
    })

    return option
  }

  state = { isOpen: false, email: '', selectedOption: null, user: [] }
  openModal = () => {
    this.setState({ ...this.state, isOpen: true })
  }

  // afterOpenModal() {
  //   // references are now sync'd and can be accessed.
  //   subtitle.style.color = '#f00';
  // }
  handleChange = (selectedOption, i) => {
    if (selectedOption.value === this.state.user[i].selectedOption) return

    let user = this.state.user.map((u, index) => {
      if (i === index) {
        return { ...u, selectedOption: selectedOption.value }
      } else return u
    })

    let role = this.props.roles.filter(role => role.roleName === selectedOption.value)

    let userID = this.state.user[i].uservalue.ID

    this.setState({
      ...this.state,
      user,
    })

    this.props.changeUserRole(role[0], userID, this.props.projectID)
  }

  closeModal = () => {
    this.setState({ ...this.state, isOpen: false })
  }

  addUser = e => {
    if (this.state.email === '') return
    this.props.handleAddUser(this.state.email, this.props.projectID)
  }

  handleDelete = ID => {
    this.props.deleteUserFromProject(ID, this.props.projectID)
  }

  render() {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '460px',
          }}
        >
          <span>
            <h5 style={{ margin: '0', padding: '0' }}>Users</h5>
            <p style={{ margin: '0', padding: '0' }}>Configuration of Users and their Roles</p>

            <p
              htmlFor="name"
              style={{
                margin: '25px 0 0 0',
                padding: '0',
                fontSize: '12px',
              }}
            >
              New User Email
            </p>
            <div
              className="input-field"
              style={{
                width: '100%',

                marginTop: '0',
              }}
            >
              <form onSubmit={e => e.preventDefault()}>
                <span>
                  <Input
                    id="email"
                    // disabled={!this.props.state.flag}
                    style={{ fontWeight: 'bolder', width: '60%' }}
                    type="email"
                    value={this.state.email}
                    required
                    onChange={e => this.setState({ ...this.state, email: e.target.value })}
                  />
                </span>
                <Button type="submit" onClick={this.addUser}>
                  Add User
                </Button>

                <Button onClick={this.openModal}>Configure Roles</Button>
              </form>
            </div>
            <div className={styles.usersList} style={{ height: '240px' }}>
              {this.state.user &&
                this.state.user.map((v, i) => (
                  <React.Fragment>
                    <p
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                      className={styles.defaultList}
                    >
                      {v.uservalue.Name}
                      <span
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Dropdown
                          options={this.state.options && this.state.options}
                          onChange={selectedOption => this.handleChange(selectedOption, i)}
                          value={v.selectedOption}
                          placeholder="Select an option"
                          className="dropdown"
                        />
                        <span
                          style={{ color: '#c4302b', marginLeft: '4px' }}
                          onClick={() => this.handleDelete(v.uservalue.ID)}
                        >
                          <Icon size={24} icon={cross} />
                        </span>
                      </span>
                    </p>
                    <hr />
                  </React.Fragment>
                ))}
              {this.props.pendingRegistrations.map(pr => (
                <React.Fragment>
                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <p className={styles.defaultList}>{pr} (Pending Registation)</p>{' '}
                    <span style={{ color: '#c4302b', marginLeft: '4px' }}>
                      <Icon
                        size={24}
                        icon={cross}
                        onClick={() => this.props.deleteEmailFromPenReg(pr, this.props.projectID)}
                      />
                    </span>
                  </span>
                  <hr />
                </React.Fragment>
              ))}
            </div>
          </span>
          <Button onClick={this.props.closeModal}>Close</Button>
        </div>
        <Modal
          isOpen={this.state.isOpen}
          onRequestClose={this.closeModal}
          className={styles.ModalRoles}
          overlayClassName="Overlay"
          shouldCloseOnOverlayClick
        >
          <Roles
            roles={this.props.roles}
            options={this.state.options}
            closeModal={this.closeModal}
            projectID={this.props.projectID}
          />
        </Modal>
      </div>
    )
  }
}

export default connect(null, {
  handleAddUser,
  changeUserRole,
  deleteUserFromProject,
  deleteEmailFromPenReg,
})(Users)
