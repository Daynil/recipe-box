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
		// Try to find cached recipes first, else add defualts
		let storedRecipes = localStorage['recipes'];
		console.log(storedRecipes);
		if (storedRecipes != 'null') {
			let storedRecipesParsed = JSON.parse(storedRecipes);
			this.setState({recipes: storedRecipesParsed});
		} else {
			let startRecipes: Recipe[] = [];
			startRecipes.push(new Recipe('Borscht', ['Beets', 'Beef Broth', 'Lamb', 'Sour Cream', 'Garlic', 'Tomato Paste', 'Diced Tomatoes']));
			startRecipes.push(new Recipe('BBQ Wings', ['Chicken wings', 'BBQ sauce']));
			startRecipes.push(new Recipe('Shephard\'s Pie', ['Ground Beef', 'Sweet Potatoes', 'Carrots', 'Onions', 'Salt', 'Pepper']));
			startRecipes.push(new Recipe('Power Shake', ['Milk', 'Protein Powder', 'Spinach', 'Ice Cubes', 'Blueberries']));
			localStorage['recipes'] = JSON.stringify(startRecipes);
			this.setState({recipes: startRecipes});	
		}
	}
	
	setSelection(selection: Recipe) {
		this.setState({selectedRecipe: selection});
	}
	
	changeIngred(e, ingredIndex) {
		let updatedRecipes = this.state.recipes.slice();
		updatedRecipes[updatedRecipes.indexOf(this.state.selectedRecipe)].ingredients[ingredIndex] = e.target.value;
		localStorage['recipes'] = JSON.stringify(updatedRecipes);
		this.setState({recipes: updatedRecipes});
	}
	
	changeName(e) {
		let updatedRecipes = this.state.recipes.slice();
		let newSelected = this.state.selectedRecipe;
		newSelected.name = e.target.value;
		updatedRecipes[updatedRecipes.indexOf(this.state.selectedRecipe)].name = e.target.value;
		localStorage['recipes'] = JSON.stringify(updatedRecipes);
		this.setState({recipes: updatedRecipes, selectedRecipe: newSelected});
	}
	
	addIngredient(e) {
		let activeIngredList = this.state.recipes[this.state.recipes.indexOf(this.state.selectedRecipe)].ingredients;
		for (let i = 0; i < activeIngredList.length; i++) if (activeIngredList[i] == '') return;
		activeIngredList.push('');
		localStorage['recipes'] = JSON.stringify(this.state.recipes);
		this.setState({recipes: this.state.recipes});
	}
	
	addRecipe() {
		let newRecipe = new Recipe('New Recipe', ['First ingredient']);
		this.state.recipes.push(newRecipe);
		localStorage['recipes'] = JSON.stringify(this.state.recipes);
		this.setState({recipes: this.state.recipes, selectedRecipe: newRecipe});
	}
	
	removeIngredient(e, index) {
		this.state.recipes[this.state.recipes.indexOf(this.state.selectedRecipe)].ingredients.splice(index, 1);
		localStorage['recipes'] = JSON.stringify(this.state.recipes);
		this.setState({recipes: this.state.recipes});
	}
	
	removeRecipe(e, recipe) {
		let indexToRemove = this.state.recipes.indexOf(this.state.selectedRecipe);
		this.state.recipes.splice(indexToRemove, 1);
		localStorage['recipes'] = JSON.stringify(this.state.recipes);
		this.setState({recipes: this.state.recipes, selectedRecipe: null});
	}
	
	render() {
		let details;
		if (this.state.selectedRecipe == null) details = null;
		else details = (
			<RecipeDetails
				selected={this.state.selectedRecipe}
				changeIngred={(e, index) => this.changeIngred(e, index)}
				changeName={(e) => this.changeName(e)}
				addIngredient={(e) => this.addIngredient(e)}
				removeIngredient={(e, index) => this.removeIngredient(e, index)}
				removeRecipe={(e, recipe) => this.removeRecipe(e, recipe)} />
		);
		return (
			<div>
				<div id="page-wrapper">
					<div id="title"><span id="title-text">Recipe Box</span><Foot /></div>
					<div id="recipe-box">
						<RecipeList
							recipes={this.state.recipes}
							selected={this.state.selectedRecipe}
							setSelection={(selection) => this.setSelection(selection)}
							addRecipe={(e) => this.addRecipe()} />
						{details}
					</div>
				</div>
			</div>
		);
	}
}

class RecipeList extends React.Component<any, any> {
	refList = [];
	
	componentWillUpdate() {
		//Clear ref list prior to each render, new ones will be populated on render
		this.refList = [];
	}
	
	render() {
		let recipes = this.props.recipes.map( (recipe: Recipe, index) => {
			return <div className={(this.props.selected == recipe) ? 'list-item selected' : 'list-item'}
						ref={(ref) => this.refList.push(ref)}
						key={index}
						onClick={() => this.props.setSelection(recipe)}>{recipe.name}</div>
		});
		return (
			<div id="recipe-list">
				<div id="recipe-title">Recipes</div>
				{recipes}
				<span className='button' onClick={(e) => this.props.addRecipe()}>Add Recipe</span>
			</div>
		);
	}
}

class RecipeDetails extends React.Component<any, any> {
	refList = [];
	titleRef;

	componentDidMount() {
		this.checkForNewRecipesAndFocus();
	}
	
	componentWillUpdate() {
		//Clear ref list prior to each render, new ones will be populated on render
		this.refList = [];
		this.titleRef = null;
	}
	
	componentDidUpdate() {
		if (this.titleRef.readOnly === false) return; // Don't refocus until we're done editing
		if (this.checkForNewRecipesAndFocus()) return;
		for (let i = this.refList.length-1; i >= 0; i--) {
			if (this.refList[i] == null) {
				this.refList.splice(i, 1);
				continue;
			}
		}
		this.checkEmptyIngredsAndFocus();
	}
	
	checkForNewRecipesAndFocus(): boolean {
		if (this.props.selected.name == 'New Recipe') {
			this.titleRef.readOnly = false;
			this.titleRef.className = 'editing';
			this.titleRef.focus();
			this.titleRef.select();
			return true;
		}
	}
	
	checkEmptyIngredsAndFocus() {
		for (let i = this.refList.length-1; i >= 0; i--) {
			if (this.refList[i].value == '' || this.refList[i].value == 'First ingredient') {
				this.refList[i].readOnly = false;
				this.refList[i].className = 'editing';
				this.refList[i].focus();
				this.refList[i].select();
				break;
			}
		}
	}
	
	editIngred(e) {
		e.target.readOnly = false;
		e.target.className = 'editing';
		e.target.focus();
		e.target.select();
	}
	
	doneEditing(e) {
		e.target.readOnly = true;
		e.target.className = 'read-only';
		this.checkEmptyIngredsAndFocus();
	}
	
	checkForEnter(e) {
		if (e.keyCode === 13) this.doneEditing(e);
	}
	
	render() {
		let selectedRecipe: Recipe = this.props.selected;
		let ingredients = selectedRecipe.ingredients.map( (ingredient, index) => {
			return (
				<div className="ingredient" key={index}>
					{index+1}.<input className='read-only'
									 value={ingredient} readOnly={true} 
									 ref={(ref) => this.refList.push(ref)}
									 onChange={(e) => this.props.changeIngred(e, index)}
									 onClick={(e) => this.editIngred(e)}
									 onBlur={(e) => this.doneEditing(e)}
									 onKeyDown={(e) => this.checkForEnter(e)}></input>
							  <i className='fa fa-times'
							  	 onClick={(e) => this.props.removeIngredient(e, index)}></i>
				</div>	
			);
		});
		return (
			<div id="recipe-details">
				<div className='recipe-title'>
					<input id="ingred-title"
						className='read-only'
						ref={(ref) => this.titleRef = ref}
						value={this.props.selected.name} readOnly={true}
						onChange={(e) => this.props.changeName(e)}
						onClick={(e) => this.editIngred(e)}
						onBlur={(e) => this.doneEditing(e)}
						onKeyDown={(e) => this.checkForEnter(e)}></input>
					<i className='fa fa-times delete-recipe'
					onClick={(e) => this.props.removeRecipe(e)}></i>
				</div>
				{ingredients}
				<span className='button' id='ingred-button'
					  onClick={(e) => this.props.addIngredient(e)}>Add Ingredient</span>
			</div>
		);
	}
}

class Recipe {
	constructor(public name: string, public ingredients: string[]) { }
}

class Foot extends React.Component<any, any> {
	render() {
		return (
			<div id="foot">
				<a id="gh-link" href="https://github.com/Daynil/recipe-box">
					<i className="fa fa-github-square fa-lg"></i>
				</a>
				<div id="foot-text">
					By <a href="https://github.com/Daynil/">Daynil</a> for <a href="http://www.freecodecamp.com/">FCC</a>
				</div>
			</div>
		);
	}
}

export default App;