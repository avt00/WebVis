package MyService;

import Model.State;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Created by user on 28.02.2017.
 */
@Repository
public class StateDAOImpl implements StateDAO {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void create(State apiRequest) {
        entityManager.persist(apiRequest);
    }

    @Override
    public void update(State apiRequest) {
        entityManager.merge(apiRequest);
    }

    @Override
    public State getStateById(long id) {
        return entityManager.find(State.class, id);
    }

    @Override
    public void delete(long id) {
        State apiRequest = getStateById(id);
        if (apiRequest != null) {
            entityManager.remove(apiRequest);
        }
    }
}
