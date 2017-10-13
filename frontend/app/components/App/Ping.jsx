import React from 'react';
import apiClient from 'lib/ApiClient';

export default class Ping extends React.Component {
  state = {
    pingResponse: null,
    error: null
  };

  componentDidMount() {
    this.ping();
  }

  async ping() {
    try {
      const pingResponse = await apiClient.get('/ping');
      this.setState({
        pingResponse,
        error: null
      });
    } catch (e) {
      this.setState({ error: `Error calling API: GET /ping. Message: ${e.error || e.message}` });
    }
  }

  render() {
    return (
      <div>
        <h3>Ping API</h3>
        {this.state.error !== null && <div className="alert alert-danger">{this.state.error}</div>}
        {this.state.error === null && <pre>{JSON.stringify(this.state.pingResponse, null, 2)}</pre>}
        <div>
          <button className="btn btn-primary" onClick={() => this.ping()}>Ping again</button>
        </div>
      </div>
    );
  }
}
