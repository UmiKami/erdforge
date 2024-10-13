import { ReactFlowProvider } from '@xyflow/react';
import ERDComponent from '../components/ERD';
import Toolbar from '../components/Toolbar';





const Home = () => {
  return (
    <div>
      <Toolbar/>
      <ReactFlowProvider>
        <ERDComponent />
      </ReactFlowProvider>

    </div>
  )
}

export default Home