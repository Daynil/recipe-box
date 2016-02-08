import * as React from 'react';

class App extends React.Component<any, any> {
	render() {
		return (
			<div id="page-wrapper">
				<div id="title"><span>Recipe Box</span></div>
				<RecipeBox />
			</div>
		);
	}
}

class RecipeBox extends React.Component<any, any> {
	render() {
		return (
			<div id="recipe-box" className="pure-g">
				<RecipeList />
				<RecipeDetails />
			</div>
		);
	}
}

class RecipeList extends React.Component<any, any> {
	render() {
		return (
			<div id="recipe-list" className="pure-u-1 pure-u-xl-1-4">
			</div>
		);
	}
}

class RecipeDetails extends React.Component<any, any> {
	render() {
		return (
			<div id="recipe-details" className="pure-u-1 pure-u-xl-3-4">
			</div>
		);
	}
}

export default App;