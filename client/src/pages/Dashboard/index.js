import { useStoreState } from 'easy-peasy';
import React from 'react';
const Dashboard = () => {

    //   const user = useStoreActions(actions => actions.auth.getCurrentPatient)
    const user = useStoreState(state => state.auth.user);
    const isLoading = useStoreState(state => state.auth.loading)

    return isLoading || user === null ? <h1> Loading...</h1 > : (
        <div>
            Dashboard
            {user.user_id}
        </div>
    )
}

export default Dashboard
