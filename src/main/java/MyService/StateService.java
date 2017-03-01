package MyService;

import Model.State;

/**
 * Created by user on 28.02.2017.
 */
public interface StateService {
    void create(State state);
    State getById(long id);
}
