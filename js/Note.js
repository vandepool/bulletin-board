var Note = React.createClass({
    // when app loads, default state of the note is set to display, not edit
    getInitialState: function() {
        return {editing: false}
    },
    // randomly position notes on board
    componentWillMount: function() {
        this.style = {
            right: this.randomBetween(0, window.innerWidth - 150) + 'px',
            top: this.randomBetween(0, window.innerHeight - 150) + 'px',
            transform: 'rotate(' + this.randomBetween(-15, 15) + 'deg)'
        };
    },
    // drag note around board
    componentDidMount: function() {
        $(this.getDOMNode()).draggable();
    },
    // generate unique key for each note
    randomBetween: function(min, max) {
        return (min + Math.ceil(Math.random() * max));
    },
    // edit note
    edit: function() {
        this.setState({editing: true});
    },
    // save note
    save: function() {
        this.props.onChange(this.refs.newText.getDOMNode().value, this.props.index);
        this.setState({editing: false});
    },
    // delete note
    remove: function() {
        this.props.onRemove(this.props.index);
    },
    // show note contents
    renderDisplay: function() {
        return( // Create note div
        <div className="note" style={this.style}>
            <p>{this.props.children}</p>
            <span>
                <button onClick={this.edit} className="btn btn-primary glyphicon glyphicon-pencil"/>
                <button onClick={this.remove} className="btn btn-danger glyphicon glyphicon-trash"/>
            </span>
        </div>
        );
    },
    // show form to edit note
    renderForm: function() {
       return(
           <div className="note" style={this.style}>
               <textarea ref="newText" defaultValue={this.props.children} className="form-control"></textarea>
               <button onClick={this.save} className="btn btn-success btn-sm glyphicon glyphicon-floppy-disk" />
           </div>
           )
    },
    // show edit form or display note on page
    render: function() {
        if (this.state.editing) {
            return this.renderForm();
        }
        else {
            return this.renderDisplay();
        }
    }    
});


// Create board for notes
var Board = React.createClass({
    // validate number of notes on board
    propTypes: {
        count: function(props, propName) {
            if (typeof props[propName] !== "number"){
                return new Error('The count property must be a number');
            }
            if (props[propName] > 100){
                return new Error("Creating " + props[propName] + " notes is excessive!");
            }
        }
    },
    // make Board a parent component of notes 
    getInitialState: function() {
        return {
            notes: []
        };
    },
    // new unique Id every time a new note is created
    nextId: function() {
        this.uniqueId = this.uniqueId || 0;
        return this.uniqueId++;
    },
    // preload board with ipsum notes, by loading JSON
    // componentWillMount: function() {
    //     var self = this;
    //     if(this.props.count) {
    //         $.getJSON(some ipsum text?);
    //     }
    // },
    // add new notes to board
    add: function(text) {
        var arr = this.state.notes;
        arr.push({
            id: this.nextId(),
            note: text
        });
        this.setState({notes:arr});
    },
    // update state of notes array
    update: function(newText, i) {
        var arr = this.state.notes;
        arr[i].note = newText;
        this.setState({notes:arr});
    },
    // remove item from array when note is deleted from board
    remove: function(i) {
        var arr = this.state.notes;
        arr.splice(i, 1);
        this.setState({notes:arr});
    },
    // return note
    eachNote: function(note, i) {
        return (
            <Note key={note.id}
                index={i}
                onChange={this.update}
                onRemove={this.remove}
            >{note.note}</Note>
        );
    },
    // populate notes & their contents to board
    render: function() {
        return (<div className="board">
            {this.state.notes.map(this.eachNote)}
            <button onClick={this.add.bind(null, "New Note")} className="btn btn-sm btn-success glyphicon glyphicon-plus addNewBtn"><span>New note</span></button>
        </div>);
    }
});

// render board
React.render(<Board count={10}/>, 
    document.getElementById('react-container'));