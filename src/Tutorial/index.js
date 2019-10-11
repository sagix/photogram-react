import React, { Component } from 'react';
import {Helmet} from "react-helmet";
import './index.css'
import TemplateSmall from '../Templates/Small'

const colors = [
    '#F44336','#E91E63','#9C27B0','#3F51B5',
    '#2196F3','#03A9F4','#00BCD4','#009688',
    '#4CAF50','#8BC34A','#CDDC39','#FFEB3B',
    '#FFC107','#FF9800','#FF5722','#795548'
]

class Example extends Component {
  constructor(props){
      super(props)
      this.state ={
          sequence:"1",
          action:"Théo est avec ses invités",
          label:"salon",
          periode:"soir",
          fx:"fx",
          url:"/demo/1.jpg",
          color: colors[5],
          colorDistribution:"limited"
      }
  }

  handleInputChange = (event) => {
     const target = event.target;
     const value = target.value;
     const name = target.name;
     if(name === "label"){
       this.setState(state => {
         return Object.assign(state,{
           label: value,
           color: value === "" ? "" : colors[value.length % 16]
         })
       });
     }else{
       this.setState(state => {
         return Object.assign(state,{[name]: value})
       });
     }

  }

  render(){
    return (
      <div className="tutorial-example-layout">
        <form className="tutorial-example-form">
          <label>Numéro de séquence</label><input type="text" name="sequence" defaultValue={this.state.sequence} onChange={this.handleInputChange}/>
          <label>Description de l'action</label><input type="text" name="action" defaultValue={this.state.action} onChange={this.handleInputChange}/>
          <label>Label</label><input type="text" name="label" defaultValue={this.state.label} onChange={this.handleInputChange}/>
          <label>Périodes</label><input type="text" name="periode" defaultValue={this.state.periode} onChange={this.handleInputChange}/>
          <label>Fx</label><input type="text" name="fx" defaultValue={this.state.fx} onChange={this.handleInputChange}/>
        </form>
        <div style={{
          fontFamily:"Courier New"
        }}>
        <TemplateSmall
          file={this.state}
          onTile={()=>{}}
        />
        </div>
      </div>
    )
  }
}

class Tutorial extends Component{
  render() {
    return (
      <div className="tutorial-container">
        <Helmet>
           <title>Photogram - Learn more about the tool for assistant editors</title>
           <meta name="description" content="Discover all the feature of Photogram and learn how to build your own data set" />
        </Helmet>
      <article className="tutorial-layout">
        <h1>Comment utiliser Photogram</h1>
        <p><strong>Photogram</strong> permet de créer un séquencier image des différentes scènes composant un film ou une série.</p>
        <section>
          <h1>1. Créer un tableau informatif</h1>
          <p>
            Première étape, remplir un tableau contenant toutes les informations nécessaires à la création du séquencier.<br/>
            Certaines de ses informations sont indispensables au bon fonctionnement de Photogram, alors que d'autres sont facultatives.<br/>
            L'ordre des colonnes du tableau doit être le suivant :<br/>
          </p>
          <ol>
            <li><strong>Numéro de séquence</strong> : Les informations de cette colonne doivent impérativement commencer par un numéro, sous peine d'être ignorées par le logiciel.</li>
            <li>Description de l'action</li>
            <li>Label : Un label est une couleur associée à vos photogrammes. Tous les photogrammes ayant le même label auront la même couleur. A vous de définir le nom de vos labels (numéro, décor, etc.)</li>
            <li>Périodes : 4 mots possibles : <em>Matin, soir, jour, nuit</em>. A choisir en fonction de la temporalité souhaitée.</li>
            <li>FX : Pour indiquer une séquence truquée, il suffit de mettre une valeur quelconque dans cette colonne.</li>
          </ol>
          <p>
            Seule la première colonne est indispensable au bon fonctionnement de Photogram. Toutes les données remplies ici pourront par la suite être modifiées directement sur le site.
          </p>
          <p>
            Une fois ce tableau complété, il doit être enregistré au format <strong>.csv</strong>, et être nommé <strong>data</strong>.
          </p>
        </section>
        <section>
          <h1>2. Exporter des photogrammes</h1>
          <p>
            Votre tableau « data » complété, et déplacé dans un dossier dédié à votre projet, vous pouvez maintenant exporter vos photogrammes, au fur et à mesure de l'avancée du tournage.<br/>
            Il suffit de les exporter au format .jpeg, de les nommer <em>exactement</em> comme les numéros de séquence utilisés dans votre tableau, et de les mettre dans le même dossier que le <strong>data</strong>.
          </p>
        </section>
        <section>
          <h1>3. Et la magie fût...</h1>
          <Example/>
          <p>
            Une fois la première étape terminée, vous pouvez d'ors et déjà importer votre projet sur Photogram, et importer manuellement vos images au fur et à mesure.<br/>
            Si des images sont déjà présentes dans le dossier, elles seront automatiquement prises en compte.
          </p>
          <p>Vous avez aussi une option vous permettant de synchroniser votre projet avec les images rajoutées au fur et à mesure dans le dossier.</p>
          <p>Maintenant que vous êtes sur le site, vous pouvez à votre convenance changer la couleur de vos labels, en supprimer, en rajouter, et modifier toutes les informations de vos photogrammes.</p>
          <p>A vous de jouer !</p>
        </section>
        <section>
          <h1>À savoir :</h1>
          <ul>
            <li>Vous pouvez maintenant exporter votre projet au format .zip afin de le travailler sur un autre ordinateur.</li>
            <li>Toutes les données de vos projets sont traitées en local, et ne sont jamais mises en ligne.</li>
          </ul>
        </section>
      </article>
      </div>
    )
  }
}

export default Tutorial;
