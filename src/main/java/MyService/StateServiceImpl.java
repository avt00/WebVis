package MyService;

import Model.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by user on 28.02.2017.
 */
@Service
@Transactional
public class StateServiceImpl  implements StateService  {

    @Autowired
    private StateDAO stateDao;

    @Override
    public void create(State state) {
        stateDao.create(state);
    }

    @Override
    public State getById(long id) {
        return stateDao.getStateById(id);
    }
}
