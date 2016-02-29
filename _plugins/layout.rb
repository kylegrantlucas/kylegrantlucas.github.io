module Jekyll
  class Layout
 
    alias old_initialize initialize
 
    def initialize(*args)
      old_initialize(*args)
      self.content = self.transform
      self.content
    end
  end
end