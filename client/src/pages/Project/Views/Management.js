import React, { Component } from 'react'
import { Input, Button } from 'antd'
import styles from '../style.module.css'

class Management extends Component {
  render() {
    return (
      <div className={styles.grid}>
        <h5>Management</h5>
        <form className={styles.detForm} onSubmit={e => e.preventDefault()}>
          <div className="input-field col s12">
            <p
              htmlFor="name"
              style={{
                margin: '25px 0 0 0',
                padding: '0',
                fontSize: '12px',
              }}
            >
              Timing
            </p>

            <Input
              disabled={!this.props.state.flag}
              type="date"
              id="estimatestart"
              name="trip-start"
              value={this.props.state.estimatestart}
              onChange={this.props.handleChange}
              style={{ fontWeight: 'bolder' }}
            />
          </div>
          <div className="input-field col s12">
            <Input
              disabled={!this.props.state.flag}
              type="date"
              id="estimatend"
              name="trip-end"
              value={this.props.state.estimatend}
              onChange={this.props.handleChange}
              style={{ fontWeight: 'bolder' }}
            />
          </div>
          <div className="input-field">
            <p
              style={{
                margin: '25px 0 0 0',
                padding: '0',
                fontSize: '12px',
              }}
            >
              Cloud Space
            </p>

            <Input
              disabled
              type="text"
              id="spaceUsed"
              placeholder="Used"
              // value={this.props.state.street}
              required
              style={{ fontWeight: 'bolder' }}
              // onChange={this.props.handleChange}
            />
          </div>
          <div className="input-field">
            <Input
              disabled
              style={{ fontWeight: 'bolder' }}
              type="text"
              id="spaceLimit"
              placeholder="Available"
              // value={this.props.state.street}
              required
              // onChange={this.props.handleChange}
            />
          </div>
          <div className="input-field">
            <p
              style={{
                margin: '25px 0 0 0',
                padding: '0',
                fontSize: '12px',
              }}
            ></p>

            <Button
              style={{
                margin: '5px 25px',
                fontSize: '10px',
                padding: '0 5px',
                width: '80%',
              }}
            >
              Request More Space
            </Button>
          </div>
          <div className="input-field">
            <p
              style={{
                margin: '25px 0 0 0',
                padding: '0',
                fontSize: '12px',
              }}
            >
              Users
            </p>
            <Input
              placeholder="Used"
              disabled
              style={{ fontWeight: 'bolder' }}
              type="text"
              id="userUsed"
              // value={this.props.state.street}
              required
              // onChange={this.props.handleChange}
            />
          </div>
          <div className="input-field">
            <Input
              disabled
              style={{ fontWeight: 'bolder' }}
              type="text"
              id="userLimit"
              placeholder="Available"
              // value={this.props.state.street}
              required
              // onChange={this.props.handleChange}
            />
          </div>
          <div className="input-field">
            <p
              style={{
                margin: '25px 0 0 0',
                padding: '0',
                fontSize: '12px',
              }}
            ></p>

            <Button
              style={{
                margin: '5px 25px',
                fontSize: '10px',
                padding: '0 5px',
                width: '80%',
              }}
            >
              Request More Users
            </Button>

            <div>
              <div className={styles.usersList}>
                <p
                  htmlFor="name"
                  style={{
                    margin: '25px 0 0 0',
                    padding: '0',
                    fontSize: '12px',
                  }}
                >
                  List of Users
                </p>
                {this.props.viewUser.map(v => (
                  <p>{v.Name}</p>
                ))}
              </div>
              {this.props.match.params.id !== 'create-project' && (
                <Button
                  style={{
                    margin: '15px 25px',
                    fontSize: '10px',
                    padding: '0 5px',
                    width: '80%',
                  }}
                  onClick={this.props.openModal}
                >
                  Configure Users
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default Management
