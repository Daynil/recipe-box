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
			<div id="recipe-box">
				<RecipeList />
				<RecipeDetails />
			</div>
		);
	}
}

class RecipeList extends React.Component<any, any> {
	render() {
		return (
			<div id="recipe-list">
				<div className="list-item">
					Borscht
				</div>
				<div className="list-item">
					Chicken Wangs
				</div>
				<div className="list-item">
					Casserole
				</div>
				<div className="list-item">
					Smoothie
				</div>
			</div>
		);
	}
}

class RecipeDetails extends React.Component<any, any> {
	render() {
		return (
			<div id="recipe-details">
			</div>
		);
	}
}

export default App;