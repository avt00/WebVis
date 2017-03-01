package MyService;
import Model.State;
/**
 * Created by user on 28.02.2017.
 */
public interface StateDAO{

    void create(State apiRequest);

    void update(State apiRequest);

    State getStateById(long id);

    void delete(long id);
}
