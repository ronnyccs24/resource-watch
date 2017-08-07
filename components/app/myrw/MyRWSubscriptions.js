import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Services
import UserService from 'services/UserService';

// Components
import Spinner from 'components/ui/Spinner';


class MyRWSubscriptions extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      subscriptions: []
    };

    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    if (!this.props.user.id) {
      this.waitForUserToBeLoaded();
    } else {
      this.loadSubscriptions();
    }
  }

  waitForUserToBeLoaded() {
    setTimeout(() => {
      if (this.props.user.id) {
        this.loadSubscriptions();
      } else {
        this.waitForUserToBeLoaded();
      }
    }, 400);
  }

  loadSubscriptions() {
    this.setState({
      loading: true
    });
    this.userService.getSubscriptions(this.props.user.token)
      .then((data) => {
        this.setState({
          subscriptions: data,
          loading: false
        });
        console.log('data', data);
      })
      .catch((err) => {
        this.setState({
          error: err,
          loading: false
        });
      });
  }

  render() {
    const { loading } = this.state;

    return (
      <div className="c-page-section">
        <div className="l-container">
          <Spinner isLoading={loading} className="-small -light" />
        </div>
      </div>
    );
  }
}

MyRWSubscriptions.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default withRedux(initStore, mapStateToProps, null)(MyRWSubscriptions);
