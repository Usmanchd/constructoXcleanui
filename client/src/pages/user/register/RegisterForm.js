import React, { Component } from 'react'
import { Form, Input, Button, message, Row, Col, Spin } from 'antd'
import { Helmet } from 'react-helmet'
import firebase from '../../../config/fbConfig'
import FileUploader from 'react-firebase-file-uploader'
import { connect } from 'react-redux'
import { signUp } from '../../../redux/user/actions'
import Loader from 'components/LayoutComponents/Loader'
import styles from './style.module.scss'

// function getBase64(img, callback) {
//   const reader = new FileReader()
//   reader.addEventListener('load', () => callback(reader.result))
//   reader.readAsDataURL(img)
// }

// function beforeUpload(file) {
//   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
//   if (!isJpgOrPng) {
//     message.error('You can only upload JPG/PNG file!')
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2
//   if (!isLt2M) {
//     message.error('Image must smaller than 2MB!')
//   }
//   return isJpgOrPng && isLt2M
// }
@Form.create()
class RegisterForm extends Component {
  state = {
    isUploading: false,
    progress: 0,
    loading: false,
    avatarURL:
      'https://firebasestorage.googleapis.com/v0/b/abstract-lane-269917.appspot.com/o/images%2F906aac0b-6844-4d3b-9f52-a4127b1b5b79.jpg?alt=media&token=423dbb46-43b0-4b43-9953-79a813ab344e',
  }
  onSubmit = event => {
    event.preventDefault()
    const { form, signUp, email, password } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        message.loading('Action in progress..', true)
        values = { ...values, email, password, avatarURL: this.state.avatarURL }
        console.log(values)
        signUp(values)
      }
    })
  }

  handleUploadStart = () => {
    this.setState({ isUploading: true, progress: 0 })
  }
  handleProgress = progress => this.setState({ progress })
  handleUploadError = error => {
    this.setState({ isUploading: false })
  }
  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100 })
    firebase
      .storage()
      .ref('images')
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ avatarURL: url }))
    setTimeout(() => {
      this.setState({ isUploading: false })
    }, 1000)
  }

  render() {
    const { form } = this.props

    // const uploadButton = (
    //   <div>
    //     {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
    //     <div className="ant-upload-text">Upload</div>
    //   </div>
    // )

    return (
      <div>
        <Helmet title="Register" />
        <div className={`${styles.title} login-heading`}>
          <h1>
            <strong>COMPLETE YOUR SIGNUP</strong>
          </h1>
          {/* <p>
            Pluggable enterprise-level react application framework.
            <br />
            An excellent front-end solution for web applications built upon Ant Design and UmiJS.
            <br />
            Credentials for testing purposes - <strong>admin@mediatec.org</strong> /{' '}
            <strong>cleanui</strong>
          </p> */}
        </div>
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>Please log in</strong>
                  </h4>
                  <br />

                  <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
                    <Row>
                      <Col span={12}>
                        <Form.Item label="Name">
                          {form.getFieldDecorator('Name', {
                            initialValue: '',
                            rules: [
                              {
                                required: true,
                                message: 'Please input your name',
                              },
                            ],
                          })(<Input size="default" />)}
                        </Form.Item>
                        <Form.Item label="Surname">
                          {form.getFieldDecorator('surname', {
                            initialValue: '',
                            rules: [
                              {
                                required: true,
                                message: 'Please input your surname',
                              },
                            ],
                          })(<Input size="default" />)}
                        </Form.Item>
                        <Form.Item label="Title">
                          {form.getFieldDecorator('title', {
                            initialValue: '',
                            rules: [
                              {
                                required: true,
                                message: 'Please input your title',
                              },
                            ],
                          })(<Input size="default" type="password" />)}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Phone">
                          {form.getFieldDecorator('phone', {
                            initialValue: '',
                            rules: [
                              {
                                required: true,
                                message: 'Please input your phone',
                              },
                            ],
                          })(<Input size="default" type="number" />)}
                        </Form.Item>
                        <Form.Item label="Image">
                          <label>
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                color: '#fbd800',
                                margin: '2px auto',
                              }}
                            >
                              <Spin
                                spinning={this.state.isUploading}
                                style={{
                                  width: '120px',
                                  height: '120px',
                                  margin: '0 auto',
                                }}
                              >
                                <img
                                  src={this.state.avatarURL}
                                  // htmlFor="image"
                                  style={{
                                    width: '120px',
                                    height: '120px',

                                    margin: '0 auto',
                                  }}
                                  alt="userIcon"
                                />
                              </Spin>
                            </div>
                            <FileUploader
                              accept="image/*"
                              name="avatar"
                              listType="picture-card"
                              className="avatar-uploader"
                              randomizeFilename
                              storageRef={firebase.storage().ref('images')}
                              onUploadStart={this.handleUploadStart}
                              onUploadError={this.handleUploadError}
                              onUploadSuccess={this.handleUploadSuccess}
                              onProgress={this.handleProgress}
                              style={{ width: '200px', display: 'none' }}
                            />
                            {/* <p className="label-low" style={{ textAlign: 'center' }}>
                          Upload Your Image
                        </p> */}
                          </label>
                        </Form.Item>
                      </Col>
                    </Row>
                    <div className="form-actions">
                      <Button type="primary" className="width-150 mr-4" htmlType="submit">
                        Sign Up
                      </Button>
                    </div>
                    {/* <div className="form-group">
                      <p>Use another service to Log In</p>
                      <div className="mt-2">
                        <a href="javascript: void(0);" className="btn btn-icon mr-2">
                          <i className="icmn-facebook" />
                        </a>
                        <a href="javascript: void(0);" className="btn btn-icon mr-2">
                          <i className="icmn-google" />
                        </a>
                        <a href="javascript: void(0);" className="btn btn-icon mr-2">
                          <i className="icmn-windows" />
                        </a>
                        <a href="javascript: void(0);" className="btn btn-icon mr-2">
                          <i className="icmn-twitter" />
                        </a>
                      </div>
                    </div> */}
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(null, { signUp })(RegisterForm)
