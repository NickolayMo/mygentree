import { Header } from "antd/es/layout/layout"
import Menu from "antd/es/menu/menu"
import { Link } from "react-router-dom"
import './AppHeader.css';


export const AppHeader: React.FC = () => {
    return(
        <Header className="app-header">
        <div className="container">
          <div className="app-title" >
            <Link to="/">Mоё дерево</Link>
          </div>
          <Menu
            className="app-menu"
            mode="horizontal"
            style={{ lineHeight: '64px' }} />
        </div>
      </Header>
    )
}