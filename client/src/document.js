import React from 'react';
import ReactDOM from 'react-dom';

class DocumentPage extends React.Component {
    constructor(props) {
        super(props);
        const urlParams = new URLSearchParams(window.location.search);
        const paperId = urlParams.get('id');
        this.state = {
            paperId: paperId,
            paper: null
        };
    }

    componentDidMount() {
        if (this.state.paperId) {
            var url = "http://127.0.0.1:5000/get?id=" + this.state.paperId
            fetch(url)
                .then(res => res.json())
                .then(
                (result) => {
                    this.setState({
                        paper: result.paper
                    });
                },
                (error) => {
                    // this.setState({
                    //     error
                    // });
                })
        }
    }

    render() {
        return (
        	<p>{JSON.stringify(this.state.paper)}</p>
        );
    }
}


export default DocumentPage;