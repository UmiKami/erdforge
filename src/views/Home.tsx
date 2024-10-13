import { ReactFlowProvider } from '@xyflow/react';
import ERDComponent from '../components/ERD';
import Toolbar from '../components/Toolbar';
import { DnDProvider } from '../store/DnDContext';





const Home = () => {
  return (
    <div>
      <ReactFlowProvider>
        <DnDProvider>
          <Toolbar />
          <ERDComponent />
        </DnDProvider>
      </ReactFlowProvider>

    </div>
  )
}

export default Home