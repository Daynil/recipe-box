import * as React from 'react';

interface StateTypes {
	recipes?: Recipe[],
	selectedRecipe?: Recipe
}

class App extends React.Component<any, StateTypes> {
	
	constructor() {
		super();
		this.state = {
			recipes: [],
			selectedRecipe: null
		}
	}
	
	componentWillMount() {
		let startRecipes: Recipe[] = [];
		startRecipes.push(new Recipe('Borscht', ['Beets', 'Water', 'Lamb', 'Sour Cream']));
		startRecipes.push(new Recipe('BBQ Wings', ['Chicken wings', 'BBQ sauce']));
		startRecipes.push(new Recipe('Shephard\'s Pie', ['Ground Beef', 'Potatoes', 'Carrots', 'Onions', 'Salt', 'Pepper']));
		startRecipes.push(new Recipe('Protein Shake', ['Milk', 'Protein Powder', 'Spinach']));
		this.setState({recipes: startRecipes});
	}
	
	setSelection(selection: Recipe) {
		this.setState({selectedRecipe: selection});
	}
	
	changeIngred(e, ingredIndex) {
		let updatedRecipes = this.state.recipes.slice();
		updatedRecipes[updatedRecipes.indexOf(this.state.selectedRecipe)].ingredients[ingredIndex] = e.target.value;
		this.setState({recipes: updatedRecipes});
	}
	
	render() {
		return (
			<div id="page-wrapper">
				<div id="title"><span>Recipe Box</span></div>
				<div id="recipe-box">
					<RecipeList
						recipes={this.state.recipes}
						selected={this.state.selectedRecipe}
						setSelection={(selection) => this.setSelection(selection)} />
					<RecipeDetails
						recipes={this.state.recipes}
						selected={this.state.selectedRecipe}
						changeIngred={(e, index) => this.changeIngred(e, index)} />
				</div>
			</div>
		);
	}
}

class RecipeList extends React.Component<any, any> {
	render() {
		let recipes = this.props.recipes.map( (recipe: Recipe, index) => {
			return <div className={(this.props.selected == recipe) ? 'list-item selected' : 'list-item'}
						key={index}
						onClick={() => this.props.setSelection(recipe)}>{recipe.name}</div>
		});
		return (
			<div id="recipe-list">
				<div id="recipe-title">Recipes</div>
				{recipes}
			</div>
		);
	}
}

class RecipeDetails extends React.Component<any, any> {
	
	editIngred(e) {
		e.target.readOnly = false;
		e.target.className = 'editing';
	}
	
	doneEditing(e) {
		e.target.readOnly = true;
		e.target.className = 'read-only';
	}
	
	checkForEnter(e) {
		if (e.keyCode === 13) this.doneEditing(e);
	}
	
	render() {
		let selectedRecipe: Recipe = this.props.selected;
		if (selectedRecipe == null) return <div></div>;
		let ingredients = selectedRecipe.ingredients.map( (ingredient, index) => {
				return (
					<div className="ingredient" key={index}>
						{index+1}.<input className='read-only'
										 value={ingredient} readOnly={true} 
										 onChange={(e) => this.props.changeIngred(e, index)}
										 onDoubleClick={(e) => this.editIngred(e)}
										 onBlur={(e) => this.doneEditing(e)}
										 onKeyDown={(e) => this.checkForEnter(e)}></input>
					</div>	
				);
		});
		return (
			<div id="recipe-details">
				<div id="ingred-title">Ingredients</div>
				{ingredients}
			</div>
		);
	}
}

class Recipe {
	constructor(public name: string, public ingredients: string[]) { }
}

export default App;