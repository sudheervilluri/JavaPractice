import java.io.Serializable;
import java.util.Collections;
import java.util.List;

public class ImmutableClass implements Serializable{
/**
	 * 
	 */
private static final long serialVersionUID = 1L;
private String employeeName;
private int empId;
private List<Country> countryList;

public ImmutableClass(String employeeName,Integer empId,List<Country> countryList) {
	this.employeeName = employeeName;
	this.empId = empId;
	this.countryList = countryList;
}

public String getEmployeeName() {
	return employeeName;
}
public int getEmpId() {
	return empId;
}
public List<Country> getCountryList() {
	return Collections.unmodifiableList(countryList);
}


}
