import java.io.Serializable;

public class Country implements Serializable {
 
 String name;
 long population;
 
 public Country(String name, long population) {
  super();
  this.name = name;
  this.population = population;
 }
 public String getName() {
  return name;
 }
 public void setName(String name) {
  this.name = name;
 }
 public long getPopulation() {
  return population;
 }
 public void setPopulation(long population) {
  this.population = population;
 }
@Override
public int hashCode() {
 final int prime = 31;
 int result = 1;
 result = prime * result + ((name == null) ? 0 : name.hashCode());

 System.out.println( name.hashCode() + " result "+result + " prime "+result   );
 return result;
}
@Override
 public boolean equals(Object obj) {
  
  Country other = (Country) obj;
   if (name.equalsIgnoreCase((other.name)))
   return true;
  return false;
 }
  
}
 