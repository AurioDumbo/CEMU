const mongoose = require('mongoose');

const estudanteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  sobrenome: {
    type: String,
    required: true
  },
  faculdade_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculdade',
    required: true
  },
  curso_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  telefone: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['Pendente', 'Ativo', 'Inativo'],
    default: 'Pendente'
  },
  sexo: {
    type: String,
    enum: ['Masculino', 'Feminino'],
    required: true
  },
  endereco: {
    type: String,
    required: true
  },
  dataNascimento: {
    type: Date,
    required: true
  },
  genero: {
    type: String,
    required: true,
    enum: ['Masculino', 'Feminino', 'Outro']
  },
  numeroBI: {
    type: String,
    required: true,
    unique: true
  },
  dataEmissaoBI: {
    type: Date,
    required: true
  },
  localEmissaoBI: {
    type: String,
    required: true
  },
  nomePai: {
    type: String,
    required: true
  },
  nomeMae: {
    type: String,
    required: true
  },
  estadoCivil: {
    type: String,
    required: true,
    enum: ['Solteiro', 'Casado', 'Divorciado', 'Viúvo']
  },
  nacionalidade: {
    type: String,
    required: true
  },
  naturalidade: {
    type: String,
    required: true
  },
  anoIngresso: {
    type: Number,
    required: true
  },
  numeroEstudante: {
    type: String,
    required: true,
    unique: true
  },
  foto: {
    type: String
  },
  documentos: [{
    tipo: String,
    url: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Estudante', estudanteSchema); 