import { Button } from "antd"
import { Link } from "react-router-dom"
import './NotFound.css';

export const NotFound: React.FC = ()=>{
    return(
        <div className="page-not-found">
        <h1 className="title">
            404
        </h1>
        <div className="desc">
            Страница не найдена
        </div>
        <Link to="/"><Button className="go-back-btn" type="primary" size="large">Go Back</Button></Link>
    </div>
    )
}