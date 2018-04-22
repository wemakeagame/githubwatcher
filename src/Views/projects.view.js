import React, { Component } from "react"
import { connect } from "react-redux"
import Moment from "react-moment"
import { Link } from "react-router-dom"
import { searchProject, setToken} from "../Reducers/github.reducer"
import {registerToken} from "../Config/apollo.client"
import "./project.view.scss"

export class ProjectsView extends Component {
    constructor(props) {
        super(props);
        this.state = { searchText: this.props.searchText, token: '' };

        if (this.props.match.params.token) {
            let token = this.props.match.params.token;

            registerToken(token);
            this.props.dispatch(setToken(token));
        }

        this.searchRepositories = this.searchRepositories.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    componentWillMount() {
        if (this.props.searchText) {
            this.props.dispatch(searchProject(this.props.searchText));
        }
    }

    searchRepositories(event) {
        this.props.dispatch(searchProject(this.state.searchText));
        event.preventDefault();
    }

    addTokenToClient() {
        registerToken(this.state.token);
        this.props.dispatch(setToken(this.state.token));
    }

    handleSearchChange(event) {
        this.setState({ searchText: event.target.value });
    }

    handleTokenChange(event) {
        this.setState({ token: event.target.value });
    }

    renderRepository(repository) {
        const repo = repository.node;
        const detailPath = "/user/" + repo.owner.login + "/" + repo.id;

        return <div className="col-lg-4 col-sm-6 col-xs-12" key={repo.id.toString()}>
            <div className="repository-item">
                <p className="repository-name">
                    {repo.name}
                    <span className="creation-date text-muted">
                        <Moment format="LL" date={repo.createdAt} />
                    </span>
                </p>
                <p className="repository-link">
                    <a href={repo.url} target="_blank" rel="">View in Github</a>
                </p>
                <Link to={detailPath} className="btn btn-light">See owner</Link>
            </div>
        </div>;
    }

    render() {
        const repos = this.props.repositories;
        const mappedRepositories = repos.length ? repos.map(repository => this.renderRepository(repository)) : <div className="no-repo-msg">No repositories</div>;

        if (!this.props.token) {
            return <div className="no-token-msg container">
                <p>you need to have a token to access</p>
                <a href="https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/" rel="">See how to create the token</a>

                <div className="token-form form-group">
                    <form >
                        <label>
                            <input className="form-control" type="text" value={this.state.token} onChange={this.handleTokenChange.bind(this)} placeholder="Add the token here..." />
                        </label>
                        <button className="btn btn-primary" onClick={this.addTokenToClient.bind(this)} >Access</button>
                    </form>
                </div>

            </div>
        }


        return <div className="content container repositories">
            <h2 className="alert alert-info">Github Watcher</h2>
            <div className="search-form form-group">
                <form onSubmit={this.searchRepositories}>
                    <label>
                        <input className="form-control" type="text" value={this.state.searchText} onChange={this.handleSearchChange} placeholder="Type the user here..." />
                    </label>
                    <button className="btn btn-primary" onClick={this.searchRepositories} >Search</button>
                </form>
            </div>
            <div className="list-repositories row">
                {mappedRepositories}
            </div>
        </div>;
    }
}

const mapStoreToProps = function (store) {
    return {
        searchText: store.searchText,
        repositories: store.repositories,
        token: store.token
    };
}

export default connect(mapStoreToProps)(ProjectsView);