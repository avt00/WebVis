package Model;

import javax.persistence.*;

@Entity
@Table(name="state")
public class State {


    public State() {
    }
    public State(String file) {
        this.file = file;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Lob
    @Column(name="FILE")
    private String file;


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }
}