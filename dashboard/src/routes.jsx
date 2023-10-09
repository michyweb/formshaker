import Home from './views/Home'
import Forms from './views/Forms'
import Patterns from './views/Patterns'

const routes = [
  { path: '/home', exact: true, name: 'Inicio', icon: 'fa fa-home', component: Home },
  { path: '/forms', exact: true, name: 'Formularios', icon: 'fa fa-wpforms', component: Forms },
  { path: '/patterns', exact: true, name: 'Patrones', icon: 'fa fa-gears', component: Patterns }
]

export default routes
