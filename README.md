# vue-storage

## Describe

> This plugin simplifid the localStorage operation.

## data type

> All JS type

## How to use
```
$ npm install vue2-localstorage
$ yarn add vue2-localstorage
```

## Create Instance
```
import Vue from 'vue';
import VueStorage from 'vue2-localstorage';

Vue.use(VueStorage);

const storage = new VueStorage({
  DB_NAME : 'test-example',
  DE_KEY  : 'id', // array item's default key
  VERSION : 'v1',
  storage : [
    {
      store   : 'account-list', 
      autoKey : true, // auto provided primary key for every item
      type    : Array, // store target's type
      key     : 'id', // like every item's primary key (set as DE_KEY if not provided)
      default : [], // default value (set as [] if not provided)
    },
    {
      store   : 'remember-password',
      type    : Boolean,
      default : true,
    },
    {
      store   : 'join-info',
      type    : Object,
      default : { account: '13123371892', password: '123456' },
    },
  ],
});

if (process.env.NODE_ENV === 'development') {
  window.storage = storage;
}
export default storage;

```

## Params

DB_NAME : database's name

DE_KAY : default key (For Array type)

VERSION : database version

storage : store items

## Operation

### Normal

| Method | Example | Description |
| :---: | :--- | --- |
| get | this.$storage.get('account-list') | Like localStorage.getItem |
| set | this.$storage.set('join-info', {"account":"admin","password":"123456"}) | Like localStorage.setItem |
| remove | storage.remove('remember-password') | Like localStorage.removeItem |

Tip: you can operate object directly.

### Advance

The plugin add some methods to handler Array 

#### insertItem

Definition: `insertItem(key, valueList)`

Example:
```
this.$storage.insertItem('account-list', [
  {name:'userA', pass: '1234'}, 
  {name:'userB', pass: '1234'}
]);
```

#### insertOrUpdate

Definition: `insertOrUpdate(key, valueList)`

Example:
```
this.$storage.insertItem('account-list', [
  {name:'userA', pass: '1234', id: "k45olgia0.jszelqpefiq1"}, // may be updated 
  {name:'userB', pass: '1234'}
]);
```

if item provide the same key (such as id), item will be updated
if not provide key or unique key , item will be inserted

#### removeItem

Definition: `removeItem(key, removedKeys)`

Example:
```
storage.removeItem('account-list', [
        'k45olgia0.jszelqpefiq1',
        'k45olgia0.412q1m7meov2'
    ])
```

#### updateItem

Definition: `updateItem(key, valueList)`

Example:
```
storage.updateItem('account-list', [
  { 
    name: "userC", 
    pass: "1234", 
    id: "k45p0gw40.a194800akpr3" 
  }
])
```

#### updateItem

Definition: `getItem(key, value)`

Example:
```
storage.getItem('account-list', 'k45p9t7r0.8n3hntpabfm5')
```

get value by primary key

#### clear

Definition: `clear(key)`

Example:
```
storage.clear('account-list')
```
the account-list's value will be set as `[]`
