import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { signIn } from '../../../redux/user/actions'
import styles from './style.module.scss'

@Form.create()
class Login extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { form, signIn } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        message.loading('Action in progress..', true)
        signIn(values)
      }
      console.log(error)
    })
  }

  render() {
    const { form } = this.props
    return (
      <div>
        <Helmet title="Login" />
        <div className={`${styles.title} login-heading`}>
          <h1>
            <strong>WELCOME TO CLEAN UI REACT - REACT REDUX ADMIN TEMPLATE</strong>
          </h1>
          <p>
            Pluggable enterprise-level react application framework.
            <br />
            An excellent front-end solution for web applications built upon Ant Design and UmiJS.
            <br />
            Credentials for testing purposes - <strong>admin@mediatec.org</strong> /{' '}
            <strong>cleanui</strong>
          </p>
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
                    <Form.Item label="Email">
                      {form.getFieldDecorator('email', {
                        initialValue: 'usman@gmail.com',
                        rules: [
                          {
                            required: true,
                            message: 'Please input your valid e-mail address',
                            pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                          },
                        ],
                      })(<Input size="default" />)}
                    </Form.Item>
                    <Form.Item label="Password">
                      {form.getFieldDecorator('password', {
                        initialValue: '123456',
                        rules: [
                          {
                            required: true,
                            message: 'Please input your password (min:6)',
                            min: 6,
                          },
                        ],
                      })(<Input size="default" type="password" />)}
                    </Form.Item>
                    <Form.Item>
                      {form.getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                      })(<Checkbox>Remember me</Checkbox>)}
                      <Link
                        to="/user/forgot"
                        className="utils__link--blue utils__link--underlined pull-right"
                      >
                        Forgot password?
                      </Link>
                    </Form.Item>
                    <div className="form-actions">
                      <Button type="primary" className="width-150 mr-4" htmlType="submit">
                        Login
                      </Button>
                      <span className="ml-3 register-link">
                        <Link to="/user/register" className="text-primary utils__link--underlined">
                          Register
                        </Link>{' '}
                        if you don&#39;t have account
                      </span>
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

export default connect(null, { signIn })(Login)
